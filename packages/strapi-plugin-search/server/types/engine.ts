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

export type EngineKey = string;

export interface EngineKeyRecord {
	field: string;
	value: EngineKey;
}

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

export interface EngineRecord {
	key: EngineKeyRecord;
	record: EngineData;
}
export interface EngineCreateParams {
	index: string;
	record: EngineRecord;
}
export interface EngineUpdateParams {
	index: string;
	record: EngineRecord;
}
export interface EngineDeleteParams {
	index: string;
	key: EngineKeyRecord;
}
export interface EngineCreateManyParams {
	index: string;
	records: EngineData[];
}
export interface EngineUpdateManyParams {
	index: string;
	records: EngineData[];
}
export interface EngineDeleteManyParams {
	index: string;
	keys: EngineKeyRecord[];
}

export abstract class Engine {
	abstract buildIndexName({ name }: { name: string }): string;
	abstract getKeyField(): string;
	abstract buildKeyValue({ value }: { value: EngineKey }): EngineKey;
	abstract create({ index, record }: EngineCreateParams): PossiblePromise<void>;
	abstract update({ index, record }: EngineUpdateParams): PossiblePromise<void>;
	abstract delete({ index, key }: EngineDeleteParams): PossiblePromise<void>;
	abstract createMany({ index, records }: EngineCreateManyParams): PossiblePromise<void>;
	abstract updateMany({ index, records }: EngineUpdateManyParams): PossiblePromise<void>;
	abstract deleteMany({ index, keys }: EngineDeleteManyParams): PossiblePromise<void>;
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
