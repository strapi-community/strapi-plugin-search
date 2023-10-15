// @ts-nocheck - TODO: remove once strapi lifecycle types are fixed or we add our own temp ones
import type { Strapi } from "@strapi/strapi";
import { ContentType } from "../types";
import { getConfig, getService } from "../utils";

export async function bootstrapLifecyles({ strapi }: { strapi: Strapi }) {
	const contentTypes = getConfig<ContentType[]>({
		strapi,
		path: "contentTypes",
		defaultValue: [],
	});

	for (const ct of contentTypes) {
		if (!ct.enabled) {
			strapi.log.info(`[search] lifecycles for ${ct.uid} were skipped as it is disabled`);
		} else {
			const builder = getService({ strapi, name: "builder" });
			const engine = getService({ strapi, name: "engine" });

			for (const index of ct.indexes) {
				strapi.db.lifecycles.subscribe({
					models: [ct.uid],
					async afterCreate(event) {
						const query = await builder.query({ ct, event });
						const data = await strapi.db.query(ct.uid).findOne(query);

						await engine.create({ ct, index, data });
					},
					async afterUpdate(event) {
						const query = await builder.query({ ct, event });
						const data = await strapi.db.query(ct.uid).findOne(query);

						await engine.update({ ct, index, data });
					},
					async afterDelete(event) {
						await engine.delete({ ct, index, key: event.result.id });
					},
					async afterCreateMany(event) {
						const query = await builder.query({ ct, event });
						const data = await strapi.db.query(ct.uid).findMany(query);
						await engine.createMany({ ct, index, data });
					},
					async beforeUpdateMany(event) {
						const query = await builder.query({ ct, event });
						const data = await strapi.db.query(ct.uid).findMany(query);
						if (!event.state.search) {
							event.state.search = {};
						}
						event.state.search.ids = data.map((record) => record.id);
					},
					async afterUpdateMany(event) {
						const query = await builder.query({ ct, event });
						const data = await strapi.db.query(ct.uid).findMany(query);

						if (!event.state.search?.ids?.length) {
							return;
						}

						await engine.updateMany({ ct, index, data });
					},
					async beforeDeleteMany(event) {
						const query = await builder.query({ ct, event });
						const data = await strapi.db.query(ct.uid).findMany(query);
						if (!event.state.search) {
							event.state.search = {};
						}
						event.state.search.ids = data.map((record) => record.id);
					},
					async afterDeleteMany(event) {
						if (!event.state.search?.ids?.length) {
							return;
						}

						await engine.deleteMany({ ct, index, keys: event.state.search.ids });
					},
				});
			}
			strapi.log.info(`[search] lifecycles for ${ct.uid} successfully registered`);
		}
	}
}
