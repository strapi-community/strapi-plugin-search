import { base } from "@strapi-plugin-search/eslint-config";
import * as react from "eslint-plugin-react";
import * as globals from "globals";

export default [
	...base,
	{
		ignores: ["strapi-admin.js", "strapi-server.js"],
	},
	{
		files: ["./admin/**/*.{ts,tsx}"],
		plugins: {
			react,
		},
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: {
				...globals.browser,
			},
		},
		settings: {
			react: {
				version: "detect",
			},
		},
	},
];
