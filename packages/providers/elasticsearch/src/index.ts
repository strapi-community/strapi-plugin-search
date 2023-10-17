import { Client } from "@elastic/elasticsearch";
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

export default class ElasticSearchEngine extends Engine {
	private indexNameRegex: RegExp;
	private keyFieldNameRegex: RegExp;
	private regexReplacementCharacter: string;
	private client: Client;
	constructor({ config }: { config: EngineConfig }) {
		super();
		this.client = new Client(config.options);
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
		await this.client.index({
			index,
			id: record.key.value,
			document: record.record,
		});
	}

	async update({ index, record }: EngineUpdateParams) {
		await this.client.update({
			index,
			id: record.key.value,
			doc: record.record,
		});
	}

	async delete({ index, key }: EngineDeleteParams) {
		await this.client.delete({ index, id: key.value });
	}

	async createMany({ index, records }: EngineCreateManyParams) {
		await this.client.helpers.bulk({
			datasource: records,
			onDocument(doc) {
				return {
					create: { _index: index, _id: doc.id },
				};
			},
		});
	}

	async updateMany({ index, records }: EngineUpdateManyParams) {
		await this.client.helpers.bulk({
			datasource: records,
			onDocument(doc) {
				return [{ update: { _index: index, _id: doc.id } }, { doc_as_upsert: true }];
			},
		});
	}

	async deleteMany({ index, keys }: EngineDeleteManyParams) {
		await this.client.helpers.bulk({
			datasource: keys,
			onDocument(doc) {
				return {
					delete: { _index: index, _id: doc.value },
				};
			},
		});
	}
}
