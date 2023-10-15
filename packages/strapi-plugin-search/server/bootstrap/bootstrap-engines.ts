import type { Strapi } from "@strapi/strapi";
import { getConfig, getService } from "../utils";
import { EngineConfig } from "../types";

export async function bootstrapEngines({ strapi }: { strapi: Strapi }) {
	const engines = getConfig<EngineConfig[]>({ strapi, path: "engines", defaultValue: [] });

	if (!engines.length) {
		throw new Error("At least one engine must be specified");
	}

	for (const engine of engines) {
		if (!engine.enabled) {
			strapi.log.info(`[search] ${engine.name} was not registered as it is disabled`);
			continue;
		}

		try {
			await getService({ strapi, name: "engine-manager" }).register(engine);
		} catch (error: any) {
			strapi.log.info(`[search] ${engine.name} was not registered due to the following error ${error.message}`);
		}
	}
}
