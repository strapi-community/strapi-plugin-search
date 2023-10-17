import algoliasearch, { SearchClient } from "algoliasearch";
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

export default class AlgoliaSearchEngine extends Engine {
	private indexNameRegex: RegExp;
	private keyFieldNameRegex: RegExp;
	private regexReplacementCharacter: string;
	private client: SearchClient;
	constructor({ config }: { config: EngineConfig }) {
		super();
		const { appId, apiKey, ...options } = config.options;
		this.client = algoliasearch(appId as string, apiKey as string, options);
		this.indexNameRegex = new RegExp(/(:|,|\.)+/g);
		this.keyFieldNameRegex = new RegExp(/(:|,|\.)+/g);
		this.regexReplacementCharacter = "_";
	}

	buildIndexName({ name }: { name: string }) {
		return name.replace(this.indexNameRegex, this.regexReplacementCharacter);
	}

	getKeyField() {
		return "objectID";
	}

	buildKeyValue({ value }: { value: EngineKey }) {
		return value.replace(this.keyFieldNameRegex, this.regexReplacementCharacter);
	}

	async create({ index, record }: EngineCreateParams) {
		const doc = record.record;
		doc[record.key.field] = record.key.value;

		await this.client.initIndex(index).saveObject(doc);
	}

	async update({ index, record }: EngineUpdateParams) {
		const doc = record.record;
		doc[record.key.field] = record.key.value;

		await this.client.initIndex(index).partialUpdateObject(doc);
	}

	async delete({ index, key }: EngineDeleteParams) {
		await this.client.initIndex(index).deleteObject(key.value);
	}

	async createMany({ index, records }: EngineCreateManyParams) {
		await this.client.initIndex(index).saveObjects(records);
	}

	async updateMany({ index, records }: EngineUpdateManyParams) {
		await this.client.initIndex(index).partialUpdateObjects(records);
	}

	async deleteMany({ index, keys }: EngineDeleteManyParams) {
		const docIds = keys.map((k) => k.value);
		await this.client.initIndex(index).deleteObjects(docIds);
	}
}
