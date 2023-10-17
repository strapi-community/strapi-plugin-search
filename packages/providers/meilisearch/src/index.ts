import { MeiliSearch, Config } from "meilisearch";
import {
	Engine,
	EngineConfig,
	EngineCreateManyParams,
	EngineCreateParams,
	EngineDeleteManyParams,
	EngineDeleteParams,
	EngineKey,
	EngineUpdateManyParams,
	EngineUpdateParams,
} from "@strapi-community/strapi-plugin-search/server";

export default class MeiliSearchEngine extends Engine {
	private client: MeiliSearch;
	private indexNameRegex: RegExp;
	private keyFieldNameRegex: RegExp;
	private regexReplacementCharacter: string;
	constructor({ config }: { config: EngineConfig }) {
		super();
		this.client = new MeiliSearch(config.options as Config);
		this.indexNameRegex = new RegExp(/(:|,|\.)+/g);
		this.keyFieldNameRegex = new RegExp(/(:|,|\.)+/g);
		this.regexReplacementCharacter = "_";
	}

	buildIndexName({ name }: { name: string }) {
		return name.replace(this.indexNameRegex, this.regexReplacementCharacter);
	}

	getKeyField() {
		return "id";
	}

	buildKeyValue({ value }: { value: EngineKey }) {
		return value.replace(this.keyFieldNameRegex, this.regexReplacementCharacter);
	}

	async create({ index, record }: EngineCreateParams) {
		const doc = record.record;
		doc[record.key.field] = record.key.value;

		await this.client.index(index).addDocuments([doc]);
	}

	async update({ index, record }: EngineUpdateParams) {
		const doc = record.record;
		doc[record.key.field] = record.key.value;

		await this.client.index(index).updateDocuments([doc]);
	}

	async delete({ index, key }: EngineDeleteParams) {
		await this.client.index(index).deleteDocument(key.value);
	}

	async createMany({ index, records }: EngineCreateManyParams) {
		await this.client.index(index).addDocuments(records);
	}

	async updateMany({ index, records }: EngineUpdateManyParams) {
		await this.client.index(index).updateDocuments(records);
	}

	async deleteMany({ index, keys }: EngineDeleteManyParams) {
		const docIds = keys.map((k) => k.value);
		await this.client.index(index).deleteDocuments(docIds);
	}
}
