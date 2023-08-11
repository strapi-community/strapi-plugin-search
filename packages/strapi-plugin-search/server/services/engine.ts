import type { Strapi } from "@strapi/strapi";
import type { EngineManagerService, EngineService } from "../types";
import { getConfig, getService, isEmptyObject } from "../utils";

export default ({ strapi }: { strapi: Strapi }): EngineService => ({

	async create({ uid, engine, index, data }) {
		const documentIdField = getConfig<string>({
			strapi,
			path: "global.documentIdField",
		});

		if (isEmptyObject(data)) return;

		const record = await getService<EngineManagerService>({
			strapi,
			name: "engineManager",
		})
			.get(engine)
			.create({
				index,
				data,
			});

		strapi.entityService.update(uid, record.id, {
			data: {
				[documentIdField]: record.documentId,
			},
		});
	},
	update({ engine, index, key, data }) {
		if (isEmptyObject(data)) return;

		getService<EngineManagerService>({ strapi, name: "engineManager" })
			.get(engine)
			.update({
				index,
				key,
				data,
			});
	},
	delete({ engine, index, key }) {
		getService<EngineManagerService>({ strapi, name: "engineManager" })
			.get(engine)
			.delete({
				index,
				key,
			});
	},
	async createMany({ uid, engine, index, data }) {
		const documentIdField = getConfig<string>({
			strapi,
			path: "global.documentIdField",
		});

		const records = data.filter((d) => isEmptyObject(d));

		if (!records.length) return;

		const iterator = getService<EngineManagerService>({
			strapi,
			name: "engineManager",
		})
			.get(engine)
			.createMany({
				index,
				data: records,
			});

		for await (const batch of iterator) {
			for await (const record of batch) {
				strapi.entityService.update(uid, record.id, {
					data: {
						[documentIdField]: record.documentId,
					},
				});
			}
		}
	},
	updateMany({ engine, index, data }) {
		const records = data.filter((d) => isEmptyObject(d));

		if (!records.length) return;

		getService<EngineManagerService>({ strapi, name: "engineManager" })
			.get(engine)
			.updateMany({
				index,
				data: records,
			});
	},
	deleteMany({ engine, index, keys }) {
		getService<EngineManagerService>({ strapi, name: "engineManager" })
			.get(engine)
			.deleteMany({
				index,
				keys,
			});
	},
});
