import type { Engine, EngineConfig } from "./engine";

export interface EngineManagerService {
	register(config: EngineConfig): Promise<void>;
	get(name: string): Engine;
	getAll(): [string, Engine][];
	size(): number;
}
