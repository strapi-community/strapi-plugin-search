import { Strapi } from "@strapi/strapi";
import path from "node:path";
import { EngineManagerService } from "../types/engine-manager";
import { Engine } from "../types";

const engines = new Map();

export default ({ strapi }: { strapi: Strapi }): EngineManagerService => {
	async function register(engine) {
		let enginePath = engine.resolve || `strapi-plugin-search-${engine.name}`;
		try {
			enginePath = path.dirname(require.resolve(enginePath));
		} catch (e) {
			enginePath = path.resolve(strapi.dirs.app.root, enginePath);
		}
		const EngineProvider = (await import(enginePath)).default;
		if (!EngineProvider) {
			throw new Error(`Engine ${engine.name} at "${enginePath}" has no export.`);
		}

		engines.set(engine.name, new EngineProvider({ config: engine.options }));
	}

	function get(name) {
		const engine = engines.get(name);

		if (!engine) throw new Error(`Engine "${name}" doesn't exist.`);

		return engine;
	}

	function getAll() {
		return Array.from(engines.entries());
	}

	function size() {
		return engines.size;
	}

	return {
		register,
		get,
		getAll,
		size,
	};
};
