import type { Strapi } from "@strapi/strapi";

export interface resolveValueParams<T> {
	value: T | ((args?: unknown) => T | Promise<T>) | ((args: unknown) => T | Promise<T>);
	args?: unknown;
}

export async function resolveValue<T>({ value, args }: resolveValueParams<T>): Promise<T> {
	if (value instanceof Function) return value(args);

	return value;
}

export function getService<T>({
	strapi,
	name,
	plugin = "search",
}: {
	strapi: Strapi;
	type?: string;
	name: string;
	plugin?: string;
}): T {
	return strapi.plugin(plugin).service(name);
}

export function getConfig<T>({
	strapi,
	path = "",
	defaultValue,
}: {
	strapi: Strapi;
	path?: string;
	defaultValue?: unknown;
}): T {
	if (path.length) path = `.${path}`;

	return strapi.config.get(`plugin.search${path}`, defaultValue);
}

export function isEmptyObject(obj: Record<string, unknown>) {
	for (const prop in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, prop)) return false;
	}

	return true;
}
