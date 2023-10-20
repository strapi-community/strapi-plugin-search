import { Strapi } from "@strapi/strapi";
import { getEngine, getService } from "../utils";
import { BuilderService, DBQuery, EngineRecord } from "../types";

export default ({ strapi }: { strapi: Strapi }): BuilderService => {
	const engineManager = getService({ strapi, name: "engine-manager" });

	function index({ index }) {
		const prefix = index.prefix || "";
		const name = index.name;

		return engineManager.get(getEngine({ strapi, engine: index.engine })).buildIndexName({ name: prefix + name });
	}

	function key({ ct, index, record }) {
		const engine = engineManager.get(getEngine({ strapi, engine: index.engine }));

		return { field: engine.getKeyField(), value: engine.buildKeyValue({ value: ct.uid + ":" + record.id }) };
	}

	async function data({ ct, index, value }) {
		if (Array.isArray(value)) {
			let records: EngineRecord[] = [];
			for (let i = 0; i < value.length; i++) {
				try {
					const data = await getService({ strapi, name: "data" }).sanitize({
						index,
						data: value[i],
					});
					let record: any | EngineRecord = {};
					const recordKey = key({ ct, index, record: value[i] });
					record[recordKey.field] = recordKey.value;
					record.record = data;
					records.push(record);
				} catch (error) {
					console.log(error);
				}
			}
			return records;
		}
		return {
			key: key({ ct, index, record: value }),
			record: await getService({ strapi, name: "data" }).sanitize({
				index,
				data: value,
			}),
		};
	}

	async function query({ ct, event }) {
		let q: DBQuery = {};
		const { action, params, state, result } = event;

		// populate single level of data
		if (action !== "beforeUpdateMany") {
			q.populate = await getService({ strapi, name: "populate-builder", plugin: "content-manager" })(ct.uid)
				.populateDeep(1)
				.build();
		}

		if (action === "beforeDeleteMany" || action === "beforeUpdateMany") {
			q.where = params.where;
			q.select = ["id"];
		} else if (action === "afterUpdateMany") {
			q.where = { id: state.search?.ids };
		} else if (action === "afterCreate" || action === "afterUpdate") {
			q.where = { id: result.id };
		} else if (action === "afterCreateMany") {
			q.where = { id: result.ids };
		}

		return q;
	}

	return {
		index,
		key,
		data,
		query,
	};
};
