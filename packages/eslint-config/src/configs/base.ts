import eslintJs from "@eslint/js";
import { default as pluginTs } from "@typescript-eslint/eslint-plugin";
import * as parserTs from "@typescript-eslint/parser";

const base = [
	{
		ignores: ["**/node_modules", "**/dist", "**/yarn.lock", "**/temp", "**/.idea", "**/.cache", "**/LICENSE*"],
	},
	eslintJs.configs.recommended,
	{
		name: "strapi-plugin-search:javascript",
		languageOptions: {
			ecmaVersion: 2022,
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: "module",
			},
			sourceType: "module",
		},
	},
	{
		// Install the plugins without globs, so they can be configured separately.
		name: "strapi-plugin-search:typescript:setup",
		plugins: {
			ts: pluginTs as any,
		},
	},
	{
		files: ["**/*.ts"],
		languageOptions: {
			parser: parserTs,
			parserOptions: {
				sourceType: "module",
				project: ["tsconfig.json"],
				tsconfigRootDir: ".",
			},
		},
		name: "strapi-plugin-search:typescript:rules",
	},
];

export { base };
