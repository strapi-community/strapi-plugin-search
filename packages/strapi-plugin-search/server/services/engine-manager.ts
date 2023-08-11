import path from "node:path";
import type { Strapi } from "@strapi/strapi";
import type { EngineConfig, EngineManagerService } from "../types";
import { Engine } from "../types";
import { getConfig } from "../utils";

class EngineManager implements EngineManagerService {
  private engines = new Map<string, Engine>();

  /**
   * Register an engine
   *
   * @param name The engine name
   * @param options The engine options
   */
  async register(config: EngineConfig) {
    let enginePath = config.resolve || `strapi-plugin-search-${config.name}`;
    try {
      enginePath = path.dirname(require.resolve(enginePath));
    } catch (e) {
      enginePath = path.resolve(strapi.dirs.app.root, enginePath);
    }
    const EngineProvider = (await import(enginePath)).default;
    if (!EngineProvider) {
      throw new Error(
        `Engine ${config.name} at "${enginePath}" has no export.`
      );
    }

    if (!(EngineProvider.prototype instanceof Engine))
      throw new Error(`Engine ${config.name} does not extend Engine`);

    const documentIdField = getConfig<string>({
      strapi,
      path: "global.documentIdField",
    });

    this.engines.set(
      config.name,
      new EngineProvider({ config, documentIdField })
    );
  }

  /**
   * Retrieve an engine
   *
   * @param name The engine name
   * @returns The requested engine
   */
  get(name: string) {
    const engine = this.engines.get(name);

    if (!engine) throw new Error(`Engine "${name}" doesn't exist.`);

    return engine;
  }

  /**
   * Retrieve the primary engine
   *
   * @returns All registered engines as a key value pair
   */
  getAll(): [string, Engine][] {
    return Array.from(this.engines.entries());
  }

  /**
   * Retrieve the number of registered engines
   *
   */
  size(): number {
    return this.engines.size;
  }
}

export default ({ strapi }: { strapi: Strapi }): EngineManagerService =>
  new EngineManager();
