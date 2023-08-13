module.exports = {
	$schema: "https://json.schemastore.org/eslintrc",
	parser: "@typescript-eslint/parser",
	env: {
		browser: true,
	},
	plugins: ["react"],
	extends: ["eslint:recommended", "plugin:react/recommended"],
	parserOptions: {
		requireConfigFile: false,
		ecmaVersion: 2018,
		ecmaFeatures: {
			jsx: true,
		},
		sourceType: "module",
		babelOptions: {
			presets: ["@babel/preset-react", "@babel/preset-typescript"],
		},
	},
	settings: {
		react: {
			version: "detect",
		},
	},
};
