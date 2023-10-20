import { describe, test, expect, beforeAll, afterAll, jest } from "@jest/globals";
import { createMockStrapi, removeTestDatabase } from "../../__mocks__/strapi";
import { getService } from "../../server/utils";
import { Strapi } from "@strapi/strapi";

let instance;
let data;
beforeAll(async () => {
	instance = await createMockStrapi();
	data = await getService({ strapi: instance as Strapi, name: "data" });
});

afterAll(async () => {
	await removeTestDatabase();
});

describe("data:sanitizeField:simple", () => {
	test("without property in data should return field only", async () => {
		const result = await data.sanitizeField({ field: "lorem", data: { name: "lorem ipsum" } });
		expect(result).toMatchObject({ field: "lorem" });
	});

	test("with property in data should return field and value", async () => {
		const result = await data.sanitizeField({ field: "name", data: { name: "lorem ipsum" } });
		expect(result).toMatchObject({ field: "name", value: "lorem ipsum" });
	});
});

describe("data:sanitizeField:complex", () => {
	test("without property in data should return field only", async () => {
		const result = await data.sanitizeField({ field: { name: "lorem" }, data: { name: "lorem ipsum" } });
		expect(result).toMatchObject({ field: "lorem" });
	});

	test("with property in data should return field and value", async () => {
		const result = await data.sanitizeField({ field: { name: "name" }, data: { name: "lorem ipsum" } });
		expect(result).toMatchObject({ field: "name", value: "lorem ipsum" });
	});

	test("custom alias and property in data should return aliased field and value", async () => {
		const result = await data.sanitizeField({
			field: { name: "name", custom: true, alias: "dolor" },
			data: { name: "lorem ipsum" },
		});
		expect(result).toMatchObject({ field: "dolor", value: "lorem ipsum" });
	});

	test("custom value and property in data should return field and custom value", async () => {
		const result = await data.sanitizeField({
			field: { name: "name", custom: true, value: "dolor" },
			data: { name: "lorem ipsum" },
		});
		expect(result).toMatchObject({ field: "name", value: "dolor" });
	});

	test("custom value function and property in data should return field and custom value", async () => {
		const result = await data.sanitizeField({
			field: { name: "name", custom: true, value: () => "dolor" },
			data: { name: "lorem ipsum" },
		});
		expect(result).toMatchObject({ field: "name", value: "dolor" });
	});
});

describe("data:sanitize:simple", () => {
	test("sanitize with global fields if no index fields provided", async () => {
		const result = await data.sanitize({
			index: { name: "articles" },
			data: { title: "lorem ipsum" },
		});
		expect(result).toMatchObject({ title: "lorem ipsum" });
	});

	test("sanitize with index fields if provided", async () => {
		const result = await data.sanitize({
			index: { name: "articles", fields: ["slug"] },
			data: { slug: "lorem-ipsum" },
		});
		expect(result).toMatchObject({ slug: "lorem-ipsum" });
	});

	test("sanitize should not includes any fields not defined in index fields", async () => {
		const result = await data.sanitize({
			index: { name: "articles", fields: ["title"] },
			data: { id: 1, title: "lorem ispum" },
		});
		expect(result).toMatchObject({ title: "lorem ispum" });
	});

	test("sanitize with multiple defined index fields if provided", async () => {
		const result = await data.sanitize({
			index: { name: "articles", fields: ["title", "slug"] },
			data: { id: 1, title: "lorem ispum", slug: "lorem-ipsum" },
		});
		expect(result).toMatchObject({ title: "lorem ispum", slug: "lorem-ipsum" });
	});
});
