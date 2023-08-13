import type { ContentTypeIndex } from "./content-type";
import type { Field } from "./field";

export interface DataService {
	sanitize({ index, data }: DataServiceSanitizeParams): Promise<Record<string, unknown>>;
}

export interface DataServiceSanitizeParams {
	index: ContentTypeIndex;
	data: Record<string, unknown>;
}

export interface DataServiceSanitizeFieldParams {
	field: string | Field;
	data: Record<string, unknown>;
}

export interface DataServiceSanitizeByFieldsParams {
	data: Record<string, unknown>;
	fields: Array<string | Field>;
}
