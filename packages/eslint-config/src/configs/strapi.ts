import parserTs from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import globals from "globals";

const strapi = {
	shared: [
		{
			ignores: ["strapi-admin.js", "strapi-server.js"],
		},
	],
	admin: [
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
				globals: globals.browser,
			},
			settings: {
				react: {
					version: "detect",
				},
			},
		},
	],
	server: [
		{
			files: ["./server/**/*.{ts,json}"],
			languageOptions: {
				parser: parserTs,
				parserOptions: {
					sourceType: "module",
					project: ["tsconfig.server.json"],
					tsconfigRootDir: ".",
				},
			},
		},
	],
};

export { strapi };
