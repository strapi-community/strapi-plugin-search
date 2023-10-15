import { MeiliSearch } from "meilisearch";
import { Engine } from "@strapi-community/strapi-plugin-search/server/types";

export default class MeiliSearchEngine implements Engine {
	private client: MeiliSearch;
	private indexNameRegex: RegExp;
	private keyFieldNameRegex: RegExp;
	private regexReplacementCharacter: string;
	constructor({ config }) {
		this.client = new MeiliSearch(config);
		this.indexNameRegex = new RegExp(/(:|,|\.)+/g);
		this.keyFieldNameRegex = new RegExp(/(:|,|\.)+/g);
		this.regexReplacementCharacter = "_";
	}
	buildIndexName({ name }) {
		return name.replace(this.indexNameRegex, this, this.regexReplacementCharacter);
	}
	getKeyField() {
		return "id";
	}
	buildKeyValue({ value }) {
		return value.replace(this.keyFieldNameRegex, this, this.regexReplacementCharacter);
	}
	async create({ index, record }) {
		const doc = record.record;
		doc[record.key.field] = record.key.value;

		await this.client.index(index).addDocuments(doc);
	}
	async update({ index, record }) {
		const doc = record.record;
		doc[record.key.field] = record.key.value;

		await this.client.index(index).updateDocuments(doc);
	}
	async delete({ index, key }) {
		await this.client.index(index).deleteDocument(key.value);
	}
	async createMany({ index, records }) {
		await this.client.index(index).addDocuments(records);
	}
	async updateMany({ index, records }) {
		await this.client.index(index).updateDocuments(records);
	}
	async deleteMany({ index, keys }) {
		const docIds = keys.map((k) => k.value);
		await this.client.index(index).deleteDocuments(docIds);
	}
}
