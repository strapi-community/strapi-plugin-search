import type { Strapi } from "@strapi/strapi";
import { PossibleFunction, PossiblePromise } from "./shared";
import SearchServices from "../services";

export interface resolveValueParams<T> {
  value: PossibleFunction<PossiblePromise<T>>;
  args?: any;
}

export interface GetServiceParams<Service> {
  strapi: Strapi;
  name: Service;
  plugin?: string;
}

export interface GetConfigParams {
  strapi: Strapi;
  path?: string;
  defaultValue?: any;
}

export type StrapiServics = { "populate-builder": any };

export type Services = typeof SearchServices & StrapiServics;

export interface GetEngineParams {
  strapi: Strapi;
  engine?: string;
}
