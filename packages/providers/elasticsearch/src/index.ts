import { Client } from "@elastic/elasticsearch";
import { Engine } from "@strapi-community/strapi-plugin-search/server/types";

export default class ElasticSearchEngine implements Engine {
	private indexNameRegex: RegExp;
	private keyFieldNameRegex: RegExp;
	private regexReplacementCharacter: string;
	private client: Client;
	constructor({ config }) {
		this.client = new Client(config);
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
		await this.client.index({
			index,
			id: record.key.value,
			document: record.record,
		});
	}
	async update({ index, record }) {
		await this.client.update({
			index,
			id: record.key.value,
			doc: record.record,
		});
	}
	async delete({ index, key }) {
		await this.client.delete({ index, id: key.value });
	}
	async createMany({ index, records }) {
		//
	}
	async updateMany({ index, records }) {
		//
	}
	async deleteMany({ index, keys }) {
		const docIds = keys.map((k) => k.value);
		//
	}
}
