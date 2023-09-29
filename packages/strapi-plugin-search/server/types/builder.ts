import { ContentType, ContentTypeIndex } from "./content-type";
import { EngineData, EngineKey, EngineRecord, EngineRecordArray } from "./engine";
import { PossiblePromise } from "./shared";

export interface BuilderService {
	index({ index }: { index: ContentTypeIndex }): string;
	key({ ct, index, record }: { ct: ContentType; index: ContentTypeIndex; record: EngineData }): {
		field: string;
		value: EngineKey;
	};
	data({
		ct,
		index,
		value,
	}: {
		ct: ContentType;
		index: ContentTypeIndex;
		value: EngineData;
	}): PossiblePromise<EngineRecord | EngineRecordArray>;
	query({ ct, event }: { ct: ContentType; event: any }): Promise<DBQuery>;
}

export interface DBQuery {
	populate?: any;
	where?: any;
	select?: any;
}
