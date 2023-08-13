import type { Strapi } from "@strapi/strapi";
import { getService } from "../utils";
import type { EngineManagerService } from "../types";
import { bootstrapEngines } from "./bootstrap-engines";
import { bootstrapLifecyles } from "./bootstrap-lifecycles";

export default async ({ strapi }: { strapi: Strapi }) => {
	await bootstrapEngines({ strapi });

	// dont register any ct if no engines have been set
	if (
		getService<EngineManagerService>({
			strapi,
			name: "engineManager",
		}).size() === 0
	)
		throw new Error("No engines have been registered");

	await bootstrapLifecyles({ strapi });
};
