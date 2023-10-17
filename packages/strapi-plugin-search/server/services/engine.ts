import { Strapi } from "@strapi/strapi";
import { getEngine, getService, isEmptyObject } from "../utils";
import { EngineRecord, EngineService } from "../types";

export default ({ strapi }: { strapi: Strapi }): EngineService => {
	const engineManager = getService({ strapi, name: "engine-manager" });
	const builder = getService({ strapi, name: "builder" });

	async function createOne({ ct, index, data }) {
		const structuredData = (await builder.data({ ct, index, value: data })) as EngineRecord;

		if (isEmptyObject(structuredData.record)) {
			return;
		}

		await engineManager.get(getEngine({ strapi, engine: index.engine })).create({
			index: builder.index({ index }),
			record: structuredData,
		});
	}

	async function updateOne({ ct, index, data }) {
		const structuredData = (await builder.data({ ct, index, value: data })) as EngineRecord;

		if (isEmptyObject(structuredData.record)) {
			return;
		}

		await engineManager.get(getEngine({ strapi, engine: index.engine })).update({
			index: builder.index({ index }),
			record: structuredData,
		});
	}

	async function deleteOne({ ct, index, key }) {
		await engineManager.get(getEngine({ strapi, engine: index.engine })).delete({
			index: builder.index({ index }),
			key: builder.key({ ct, index, record: { id: key } }),
		});
	}

	async function createMany({ ct, index, data }) {
		const structuredData = (await builder.data({ ct, index, value: data })) as EngineRecord[];

		const records = structuredData.filter((data) => !isEmptyObject(data));

		if (!records.length) {
			return;
		}

		await engineManager.get(getEngine({ strapi, engine: index.engine })).createMany({
			index: builder.index({ index }),
			records,
		});
	}

	async function updateMany({ ct, index, data }) {
		const structuredData = (await builder.data({ ct, index, value: data })) as EngineRecord[];
		const records = structuredData.filter((record) => !isEmptyObject(record));
		if (!records.length) {
			return;
		}
		await engineManager.get(getEngine({ strapi, engine: index.engine })).updateMany({
			index: builder.index({ index }),
			records,
		});
	}

	async function deleteMany({ ct, index, keys }) {
		await engineManager.get(getEngine({ strapi, engine: index.engine })).deleteMany({
			index: builder.index({ index }),
			keys: keys.map((id) => builder.key({ ct, index, record: { id } })),
		});
	}

	return {
		create: createOne,
		update: updateOne,
		delete: deleteOne,
		createMany,
		updateMany,
		deleteMany,
	};
};
