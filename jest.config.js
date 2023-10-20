/** @type {import('jest').Config} */
const config = {
	verbose: true,
	projects: [
		{
			displayName: "search",
			roots: ["<rootDir>/packages/strapi-plugin-search/"],
			testRegex: ["/__tests__/.*\\.spec\\.ts$"],
			testPathIgnorePatterns: [
				"<rootDir>/node_modules",
				"<rootDir>/dist",
				"<rootDir>/temp",
				"<rootDir>/.idea",
				"<rootDir>/.cache",
			],
		},
	],
};

module.exports = config;
