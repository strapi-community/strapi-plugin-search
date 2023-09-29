import { Strapi } from "@strapi/strapi";
import { getConfig, resolveValue } from "../utils";
import { DataService, EngineData, Field, ProcessedField } from "../types";

export default ({ strapi }: { strapi: Strapi }): DataService => {
	const defaultFields = getConfig<Field[]>({ strapi, path: "global.fields" });

	async function sanitize({ index, data }) {
		const fields = index.fields || defaultFields;
		const obj: EngineData = {};

		if (!fields) {
			return obj;
		}

		for (const field of fields) {
			const base = await this.sanitizeField({ field, data });
			if (base.value) {
				obj[base.field] = base.value;
			}
		}
		return obj;
	}

	async function sanitizeField({ field, data }) {
		const isComplex = typeof field === "object";
		const fieldName = isComplex ? field.name : field;
		const hasField = fieldName in data;
		const base: ProcessedField = {
			field: fieldName,
		};

		if (!hasField && !isComplex) {
			return base;
		}

		base.value = data[base.field];
		if (!isComplex) {
			return base;
		}

		if (!field.custom && !hasField) {
			return base;
		}

		if (field.alias) {
			base.field = field.alias;
		}

		if (field.value) {
			base.value = await resolveValue({
				value: field.value,
				args: { record: data },
			});
		}

		return base;
	}

	return {
		sanitize,
		sanitizeField,
	};
};
