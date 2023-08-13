import type { Strapi } from "@strapi/strapi";
import { getConfig } from "./utils";
import type { ContentType } from "./types";

export default ({ strapi }: { strapi: Strapi }) => {
	// register a document id field for all indexed content types
	const indexedContentTypes = getConfig<ContentType[]>({
		strapi,
		path: "contentTypes",
		defaultValue: [],
	});

	const documentIdField = getConfig<string>({
		strapi,
		path: "global.documentIdField",
	});

	for (const indexedCT of indexedContentTypes) {
		if (strapi.contentTypes[indexedCT.uid] && !strapi.contentTypes[indexedCT.uid].attributes[documentIdField]) {
			strapi.log.info(`injected ${documentIdField} into ${indexedCT.uid}`);
			strapi.contentTypes[indexedCT.uid].attributes[documentIdField] = {
				type: "string",
			};
		}
	}
};
