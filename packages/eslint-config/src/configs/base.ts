import eslintJs from "@eslint/js";

const base = [
	{
		ignores: ["**/node_modules", "**/dist", "**/yarn.lock", "**/temp", "**/.idea", "**/.cache", "**/LICENSE*"],
	},
	eslintJs.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: 2022,
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: "module",
			},
			sourceType: "module",
		},
	},
];

export { base };
