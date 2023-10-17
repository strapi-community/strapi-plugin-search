import { ContentTypeIndex } from "./content-type";
import { EngineData } from "./engine";
import { Field } from "./field";
import { PossiblePromise } from "./shared";

export interface DataService {
	sanitize({ index, data }: { index: ContentTypeIndex; data: EngineData }): PossiblePromise<ProcessedField>;
	sanitizeField({ field, data }: { field: Field; data: EngineData }): PossiblePromise<ProcessedField>;
}

export interface ProcessedField {
	field?: string;
	value?: any;
}
