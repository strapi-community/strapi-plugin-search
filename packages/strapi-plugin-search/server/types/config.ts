import type { ContentType } from "./content-type";
import type { EngineConfig, Index } from "./engine";
import type { Field } from "./field";

export interface PluginConfig {
	global: {
		index?: Index;
		engine?: string;
		fields?: Array<string | Field>;
		documentIdField?: string;
	};
	engines: EngineConfig[];
	contentTypes?: ContentType[];
}
