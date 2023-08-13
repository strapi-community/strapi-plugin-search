import type { Index } from "./engine";
import type { Field } from "./field";

export interface ContentType {
	uid: string;
	enabled?: boolean;
	indexes: ContentTypeIndex[];
}

export interface ContentTypeIndex extends Index {
	engine?: string;
	fields?: Array<string | Field>;
}
