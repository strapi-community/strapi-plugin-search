module.exports = {
	$schema: "https://json.schemastore.org/eslintrc",
	root: true,
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		project: ["*/tsconfig.json"],
	},
	rules: {
		"no-unused-vars": "off",
		"@typescript-eslint/no-unused-vars": "error",
	},
	plugins: ["@typescript-eslint"],
	overrides: [
		{
			files: ["./server/**/*.{ts}"],
			...require("./.eslintrc.backend.js"),
		},
		{
			files: ["./admin/**/*.{ts,tsx}"],
			...require("./.eslintrc.frontend.js"),
		},
	],
};
