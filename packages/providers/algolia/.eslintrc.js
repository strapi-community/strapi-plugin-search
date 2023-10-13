module.exports = {
	$schema: "https://json.schemastore.org/eslintrc",
	root: true,
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		project: ["*/tsconfig.json"],
	},
	plugins: ["@typescript-eslint"],
};
