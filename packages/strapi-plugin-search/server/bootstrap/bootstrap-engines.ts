import type { Strapi } from "@strapi/strapi";
import type { EngineConfig, EngineManagerService } from "../types";
import { getConfig, getService } from "../utils";

export async function bootstrapEngines({ strapi }: { strapi: Strapi }) {
  const engines = getConfig<EngineConfig[]>({
    strapi,
    path: "engines",
    defaultValue: [],
  });

  if (!engines.length) throw new Error("At least one engine must be specified");

  await Promise.allSettled(
    engines
      .filter((engine) => engine.enabled)
      .map((engine) => {
        return getService<EngineManagerService>({
          strapi,
          name: "engineManager",
        }).register(engine);
      })
  );
}
