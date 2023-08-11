export interface EngineValidateIndexNameParams {
  name: string;
}

export interface EngineKeyParam {
  key: string;
}

export interface EngineKeysParam {
  keys: string[];
}

export interface EngineIndexParam {
  index: string;
}

export interface EngineDataParam<T> {
  data: T;
}

export type EngineValidateDocumentKeyParams = EngineKeyParam;
export type EngineValidateDocumentKey = EngineIndexParam & EngineKeyParam;
export type EngineCreateParams = EngineIndexParam &
  EngineDataParam<Record<string, unknown>>;
export type EngineUpdateParams = EngineIndexParam &
  EngineDataParam<Record<string, unknown>> &
  EngineKeyParam;
export type EngineDeleteParams = EngineIndexParam & EngineKeyParam;
export type EngineCreateManyParams = EngineIndexParam &
  EngineDataParam<Record<string, unknown>[]>;
export type EngineUpdateManyParams = EngineIndexParam &
  EngineDataParam<Record<string, unknown>[]>;
export type EngineDeleteManyParams = EngineIndexParam & EngineKeysParam;

export interface EngineCreateResponse {
  id: string;
  documentId: string;
}

export abstract class Engine {
  abstract validateIndexName({ name }: EngineValidateIndexNameParams): boolean;
  abstract validateDocumentKey({
    key,
  }: EngineValidateDocumentKeyParams): boolean;
  abstract create({
    index,
    data,
  }: EngineCreateParams): EngineCreateResponse | Promise<EngineCreateResponse>;
  abstract update({
    index,
    key,
    data,
  }: EngineUpdateParams): void | Promise<void>;
  abstract delete({ index, key }: EngineDeleteParams): void | Promise<void>;
  abstract createMany({
    index,
    data,
  }: EngineCreateManyParams):
    | IterableIterator<EngineCreateResponse[]>
    | IterableIterator<Promise<EngineCreateResponse[]>>;
  abstract updateMany({
    index,
    data,
  }: EngineUpdateManyParams): void | Promise<void>;
  abstract deleteMany({
    index,
    keys,
  }: EngineDeleteManyParams): void | Promise<void>;
}

export interface EngineConfig {
  name: string;
  resolve?: string;
  enabled?: boolean;
  options: Record<string, unknown>;
}

export interface EngineServiceEngineParam {
  engine: string;
}

export interface EngineServiceUIDParam {
  uid: string;
}

export type EngineServiceIndexParam = EngineIndexParam;
export type EngineServiceDataParam<T> = EngineDataParam<T>;
export type EngineServiceKeyParam = EngineKeyParam;
export type EngineServiceKeysParam = EngineKeysParam;

export type EngineServiceCreateParams = EngineServiceEngineParam &
  EngineServiceIndexParam &
  EngineServiceDataParam<Record<string, unknown>> &
  EngineServiceUIDParam;
export type EngineServiceUpdateParams = EngineServiceEngineParam &
  EngineServiceIndexParam &
  EngineServiceDataParam<Record<string, unknown>> &
  EngineServiceKeyParam;
export type EngineServiceDeleteParams = EngineServiceEngineParam &
  EngineServiceIndexParam &
  EngineServiceKeyParam;
export type EngineServiceCreateManyParams = EngineServiceEngineParam &
  EngineServiceIndexParam &
  EngineServiceDataParam<Record<string, unknown>[]> &
  EngineServiceUIDParam;
export type EngineServiceUpdateManyParams = EngineServiceEngineParam &
  EngineServiceIndexParam &
  EngineServiceDataParam<Record<string, unknown>[]>;
export type EngineServiceDeleteManyParams = EngineServiceEngineParam &
  EngineServiceIndexParam &
  EngineServiceKeysParam;

export interface Index {
  prefix?: string;
  name: string | (({ record }) => string | Promise<string>);
}

export interface EngineService {
  create({ uid, engine, index, data }: EngineServiceCreateParams): void;
  update({ engine, index, key, data }: EngineServiceUpdateParams): void;
  delete({ engine, index, key }: EngineServiceDeleteParams): void;
  createMany({ uid, engine, index, data }: EngineServiceCreateManyParams): void;
  updateMany({ engine, index, data }: EngineServiceUpdateManyParams): void;
  deleteMany({ engine, index, keys }: EngineServiceDeleteManyParams): void;
}
