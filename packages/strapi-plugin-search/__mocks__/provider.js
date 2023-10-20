import { Engine } from "../server/types";

export default class MockProviderEngine extends Engine {
	constructor({ config }) {
		super();
		this.indexNameRegex = new RegExp(/(\s|:|,|\.)+/g);
		this.keyFieldNameRegex = new RegExp(/(\s|:|,|\.)+/g);
		this.regexReplacementCharacter = "_";
	}

	buildIndexName({ name }) {
		return name.replace(this.indexNameRegex, this.regexReplacementCharacter);
	}

	getKeyField() {
		return "id";
	}

	buildKeyValue({ value }) {
		return value.replace(this.keyFieldNameRegex, this.regexReplacementCharacter);
	}

	async create({ index, record }) {}

	async update({ index, record }) {}

	async delete({ index, key }) {}

	async createMany({ index, records }) {}

	async updateMany({ index, records }) {}

	async deleteMany({ index, keys }) {}
}
