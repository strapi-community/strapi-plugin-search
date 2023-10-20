import { describe, test, expect, beforeAll, afterAll, jest } from "@jest/globals";
import { createMockStrapi, removeTestDatabase } from "../../__mocks__/strapi";
import { getService } from "../../server/utils";
import { Strapi } from "@strapi/strapi";

let instance;
let builder;
beforeAll(async () => {
	instance = await createMockStrapi();
	builder = await getService({ strapi: instance as Strapi, name: "builder" });
});

afterAll(async () => {
	await removeTestDatabase();
});

describe("builder:index", () => {
	test("index name should build name with default provider if none provided", async () => {
		const index = builder.index({ index: { name: "strapi:articles" } });
		expect(index).toBe("strapi-articles");
	});

	test("index name should build name with defined provider when provided", async () => {
		const index = builder.index({ index: { engine: "lorem", name: "strapi:articles", fields: ["title", "slug"] } });
		expect(index).toBe("strapi_articles");
	});
});

describe("builder:key", () => {
	test("key record should use default provider if none provided", async () => {
		const key = builder.key({
			ct: { uid: "api::article.article", indexes: [{ name: "article" }] },
			index: { name: "articles", fields: ["title", "slug"] },
			record: { id: 1 },
		});

		expect(key).toMatchObject({ field: "ObjectId", value: "api-article-article-1" });
	});

	test("key record should use defined provider when provided", async () => {
		const key = builder.key({
			ct: { uid: "api::article.article", indexes: [{ name: "article" }] },
			index: { engine: "lorem", name: "articles", fields: ["title", "slug"] },
			record: { id: 1 },
		});

		expect(key).toMatchObject({ field: "id", value: "api_article_article_1" });
	});
});

describe("builder:data", () => {
	test("data should return sanitized array for array value", async () => {
		const data = await builder.data({
			ct: { uid: "api::article.article", indexes: [{ name: "article" }] },
			index: { engine: "lorem", name: "articles", fields: ["title", "slug"] },
			value: [
				{ id: 1, title: "lorem ipsum", slug: "lorem-ipsum", content: "lorem ipsum dolor sat amet" },
				{ id: 2, title: "ipsum lorem", slug: "ipsum-lorem", content: "amte sat dolor ipsum lorem" },
			],
		});

		expect(data).toStrictEqual([
			{ id: "api_article_article_1", record: { slug: "lorem-ipsum", title: "lorem ipsum" } },
			{ id: "api_article_article_2", record: { slug: "ipsum-lorem", title: "ipsum lorem" } },
		]);
	});

	test("data should return sanitized record for object value", async () => {
		const data = await builder.data({
			ct: { uid: "api::article.article", indexes: [{ name: "article" }] },
			index: { name: "articles", fields: ["title", "slug"] },
			value: { id: 1, title: "lorem ipsum", slug: "lorem-ipsum", content: "lorem ipsum dolor sat amet" },
		});

		expect(data).toMatchObject({
			key: {
				field: "ObjectId",
				value: "api-article-article-1",
			},
			record: {
				slug: "lorem-ipsum",
				title: "lorem ipsum",
			},
		});
	});
});

describe("builder:query", () => {
	test("query built for afterCreate should have where and populate", async () => {
		const query = await builder.query({
			ct: { uid: "api::article.article", indexes: [{ name: "article" }] },
			event: {
				action: "afterCreate",
				state: {},
				params: {},
				result: { id: 1, title: "lorem-ipsum" },
			},
		});

		expect(query).toMatchObject({
			where: { id: 1 },
			populate: {
				createdBy: {},
			},
		});
	});
	test("query built for afterUpdate should have where and populate", async () => {
		const query = await builder.query({
			ct: { uid: "api::article.article", indexes: [{ name: "article" }] },
			event: {
				action: "afterUpdate",
				state: {},
				params: {},
				result: { id: 1, title: "lorem-ipsum" },
			},
		});

		expect(query).toMatchObject({
			where: { id: 1 },
			populate: {},
		});
	});
	test("query built for afterCreateMany should have where and populate", async () => {
		const query = await builder.query({
			ct: { uid: "api::article.article", indexes: [{ name: "article" }] },
			event: {
				action: "afterCreateMany",
				state: {},
				params: {},
				result: { ids: [1, 2, 3, 4] },
			},
		});

		expect(query).toMatchObject({
			where: { id: [1, 2, 3, 4] },
			populate: {},
		});
	});
	test("query built for beforeUpdateMany should have where and select", async () => {
		const query = await builder.query({
			ct: { uid: "api::article.article", indexes: [{ name: "article" }] },
			event: {
				action: "beforeUpdateMany",
				state: {},
				params: { where: { title: "lorem-ipsum" } },
				result: {},
			},
		});

		expect(query).toMatchObject({
			where: { title: "lorem-ipsum" },
			select: ["id"],
		});
	});
	test("query built for afterUpdateMany should have where and populate", async () => {
		const query = await builder.query({
			ct: { uid: "api::article.article", indexes: [{ name: "article" }] },
			event: {
				action: "afterUpdateMany",
				state: {
					search: { ids: [1, 2, 3, 4] },
				},
				params: {},
				result: {},
			},
		});

		expect(query).toMatchObject({
			where: { id: [1, 2, 3, 4] },
			populate: {},
		});
	});
	test("query built for beforeDeleteMany should have where and select", async () => {
		const query = await builder.query({
			ct: { uid: "api::article.article", indexes: [{ name: "article" }] },
			event: {
				action: "beforeDeleteMany",
				state: {},
				params: {
					where: { title: "lorem-ipsum" },
				},
				result: {},
			},
		});

		expect(query).toMatchObject({
			where: { title: "lorem-ipsum" },
			select: ["id"],
		});
	});
});
