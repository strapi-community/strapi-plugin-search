import { ContentType, ContentTypeIndex } from "./content-type";
import { PossiblePromise } from "./shared";

export interface EngineConfig {
	name: string;
	resolve?: string;
	enabled?: boolean;
	options: Record<string, unknown>;
}

export interface Index {
	prefix?: string;
	name: string;
}

export type EngineKey = string | number;

export interface EngineKeyParam {
	key: EngineKey;
}

export interface EngineKeysParam {
	keys: EngineKey[];
}

export interface EngineContentTypeParam {
	ct: ContentType;
}
export interface EngineIndexParam {
	index: ContentTypeIndex;
}

export type EngineData = Record<string, any>;

export interface EngineDataParam {
	data: EngineData;
}

export interface EngineDataArrayParam {
	data: EngineData[];
}

export interface EngineRecordParam {
	record: EngineData;
}

export interface EngineRecordArrayParam {
	record: EngineData[];
}

export type EngineCreateParams = EngineContentTypeParam & EngineIndexParam & EngineDataParam;
export type EngineUpdateParams = EngineContentTypeParam & EngineIndexParam & EngineDataParam;
export type EngineDeleteParams = EngineContentTypeParam & EngineIndexParam & EngineKeyParam;
export type EngineCreateManyParams = EngineContentTypeParam & EngineIndexParam & EngineDataArrayParam;
export type EngineUpdateManyParams = EngineContentTypeParam & EngineIndexParam & EngineDataArrayParam;
export type EngineDeleteManyParams = EngineContentTypeParam & EngineIndexParam & EngineKeysParam;

export abstract class Engine {
	abstract buildIndexName({ name }: { name: string }): string;
	abstract getKeyField(): string;
	abstract buildKeyValue({ value }: { value: EngineKey }): EngineKey;
	abstract create({ index, record }: { index: string; record: EngineData }): PossiblePromise<void>;
	abstract update({ index, record }: { index: string; record: EngineData }): PossiblePromise<void>;
	abstract delete({ index, key }: { index: string; key: { field: string; value: EngineKey } }): PossiblePromise<void>;
	abstract createMany({ index, records }: { index: string; records: EngineRecordArrayParam }): PossiblePromise<void>;
	abstract updateMany({ index, records }: { index: string; records: EngineRecordArrayParam }): PossiblePromise<void>;
	abstract deleteMany({
		index,
		keys,
	}: {
		index: string;
		keys: Array<{ field: string; value: EngineKey }>;
	}): PossiblePromise<void>;
}

export type EngineServiceCreateParams = EngineContentTypeParam & EngineIndexParam & EngineDataParam;
export type EngineServiceUpdateParams = EngineContentTypeParam & EngineIndexParam & EngineDataParam;
export type EngineServiceDeleteParams = EngineContentTypeParam & EngineIndexParam & EngineKeyParam;
export type EngineServiceCreateManyParams = EngineContentTypeParam & EngineIndexParam & EngineDataParam;
export type EngineServiceUpdateManyParams = EngineContentTypeParam & EngineIndexParam & EngineDataParam;
export type EngineServiceDeleteManyParams = EngineContentTypeParam & EngineIndexParam & EngineKeysParam;

export interface EngineService {
	create({ ct, index, data }: EngineServiceCreateParams): PossiblePromise<void>;
	update({ ct, index, data }: EngineServiceUpdateParams): PossiblePromise<void>;
	delete({ ct, index, key }: EngineServiceDeleteParams): PossiblePromise<void>;
	createMany({ ct, index, data }: EngineServiceCreateManyParams): PossiblePromise<void>;
	updateMany({ ct, index, data }: EngineServiceUpdateManyParams): PossiblePromise<void>;
	deleteMany({ ct, index, keys }: EngineServiceDeleteManyParams): PossiblePromise<void>;
}
