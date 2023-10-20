"use strict";

module.exports = ({ env }) => ({
	"users-permissions": {
		config: {
			jwt: {
				expiresIn: "7d",
			},
			jwtSecret: "some-up-jwt-secret",
		},
	},
	search: {
		enabled: true,
		config: {
			global: {
				index: "default",
				engine: "dolor-sat",
				fields: ["title"],
			},
			engines: [
				{
					name: "lorem",
					enabled: true,
					resolve: "../packages/strapi-plugin-search/__mocks__/provider.js",
					options: {},
				},
				{
					name: "dolor-sat",
					enabled: true,
					resolve: "../packages/strapi-plugin-search/__mocks__/default-provider.js",
					options: {},
				},
			],
			contentTypes: [
				{
					uid: "api::article.article",
					enabled: true,
					indexes: [{ engine: "lorem", name: "articles", fields: ["title", "slug"] }],
				},
				{ uid: "api::page.page", enabled: true, indexes: [{ engine: "lorem", name: "pages", fields: ["title"] }] },
			],
		},
	},
});
