import {
  GetConfigParams,
  GetEngineParams,
  GetServiceParams,
  PossiblePromise,
  Services,
  resolveValueParams,
} from "../types";

export function getService<Service extends keyof Services>({
  strapi,
  name,
  plugin = "search",
}: GetServiceParams<Service>) {
  const service = strapi.service<ReturnType<Services[Service]>>(`plugin::${plugin}.${name}`);
  return service as Exclude<typeof service, undefined>;
}

export function getConfig<T>({ strapi, path = "", defaultValue }: GetConfigParams): T {
  if (path.length) {
    path = `.${path}`;
  }

  return strapi.config.get(`plugin.search${path}`, defaultValue);
}

export function resolveValue<T>({ value, args }: resolveValueParams<T>): PossiblePromise<T> {
  if (value instanceof Function) {
    return value(args);
  }

  return value;
}

export function isEmptyObject(obj: Record<string, any>) {
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }

  return true;
}

export function getEngine({ strapi, engine }: GetEngineParams): string {
  const defaultEngine = getConfig<string>({ strapi, path: "global.index.engine" });

  return engine || defaultEngine;
}
