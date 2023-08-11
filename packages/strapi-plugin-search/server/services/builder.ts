import type { Strapi } from "@strapi/strapi";
import { getConfig, getService, resolveValue } from "../utils";
import type {
	BuilderService,
	BuilderServiceDataParams,
	BuilderServiceIndexParams,
	BuilderServiceKeyParams,
	DataService,
} from "../types";

export default ({ strapi }: { strapi: Strapi }): BuilderService => ({
	index({ index, value }: BuilderServiceIndexParams) {
		if (index.name) {
			return resolveValue<string>({
				value: index.name,
				args: {
					record: value,
				},
			});
		}

		return resolveValue<string>({
			value: strapi.config.get("plugin.search.index.name"),
			args: {
				record: value,
			},
		});
	},
	key({ value }: BuilderServiceKeyParams) {
		const documentIdField = getConfig<string>({
			strapi,
			path: "global.documentIdField",
		});
		return value[documentIdField] as string;
	},
	data({ index, value }: BuilderServiceDataParams) {
		if (Array.isArray(value)) {
			return Promise.all(
				value.map((value) =>
					getService<DataService>({ strapi, name: "data" }).sanitize({
						index,
						data: value,
					})
				)
			);
		}

		return getService<DataService>({ strapi, name: "data" }).sanitize({
			index,
			data: value,
		});
	},
});
