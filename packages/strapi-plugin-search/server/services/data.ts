import type { Strapi } from "@strapi/strapi";
import type {

	DataService,
	DataServiceSanitizeByFieldsParams,
	DataServiceSanitizeFieldParams,
	DataServiceSanitizeParams,

} from "../types";
import { resolveValue } from "../utils";

export default ({ strapi }: { strapi: Strapi }): DataService => ({

	async sanitize({ index, data = {} }: DataServiceSanitizeParams) {
		const globalFields = strapi.config.get("plugin.search.global.fields");
		if (index.fields) return sanitizeByFields({ data, fields: index.fields });

		if (globalFields) return sanitizeByFields({ data, fields: globalFields });

		return {};
	},
});

async function sanitizeByFields({
	data,
	fields,
}: DataServiceSanitizeByFieldsParams) {
	const obj = {};
	for (const field of fields) {
		const base = await sanitizeField({ field, data });
		if (base.fieldValue) obj[base.fieldName] = base.fieldValue;
	}
	return obj;
}

async function sanitizeField({ field, data }: DataServiceSanitizeFieldParams) {
	const isComplex = typeof field !== "string";
	const fieldName = isComplex ? field.name : field;
	const base: { fieldName: string; fieldValue?: unknown } = {
		fieldName,
	};

	if (!(fieldName in data) && !isComplex) return base;

	if (!isComplex) {
		base.fieldValue = data[fieldName];
		return base;
	}

	if (!field.include) return base;

	if (!field.custom && !(fieldName in data)) return base;

	if (field.alias) base.fieldName = field.alias;

	if (field.value) {
		base.fieldValue = await resolveValue({
			value: field.value,
			args: { record: data },
		});
	}

	return base;
}
