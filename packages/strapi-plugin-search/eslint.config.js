import * as eslint from "@strapi-plugin-search/eslint-config";

export default [
	...eslint.base,
	...eslint.ts.plugin,
	...eslint.strapi.shared,
	...eslint.strapi.admin,
	...eslint.strapi.server,
];
