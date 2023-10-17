import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const ts = {
	plugin: [
		{
			plugins: {
				ts: tsPlugin as any,
			},
		},
	],
	parser: [
		{
			files: ["**/*.ts"],
			languageOptions: {
				parser: tsParser,
				parserOptions: {
					sourceType: "module",
					project: ["tsconfig.json"],
					tsconfigRootDir: ".",
				},
			},
		},
	],
};

export { ts };
