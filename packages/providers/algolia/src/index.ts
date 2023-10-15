import algoliasearch, { SearchClient } from "algoliasearch";
import { Engine } from "@strapi-community/strapi-plugin-search/server/types";

export default class AlgoliaSearchEngine implements Engine {
  private indexNameRegex: RegExp;
  private keyFieldNameRegex: RegExp;
  private regexReplacementCharacter: string;
  private client: SearchClient;
  constructor({ config }) {
    this.client = algoliasearch(config.appId, config.apiKey, config.options);
    this.indexNameRegex = new RegExp(/(:|,|\.)+/g);
    this.keyFieldNameRegex = new RegExp(/(:|,|\.)+/g);
    this.regexReplacementCharacter = "_";
  }
  buildIndexName({ name }) {
    return name.replace(this.indexNameRegex, this, this.regexReplacementCharacter);
  }
  getKeyField() {
    return "objectID";
  }
  buildKeyValue({ value }) {
    return value.replace(this.keyFieldNameRegex, this, this.regexReplacementCharacter);
  }
  async create({ index, record }) {
    const doc = record.record;
    doc[record.key.field] = record.key.value;

    await this.client.initIndex(index).saveObject(doc);
  }
  async update({ index, record }) {
    const doc = record.record;
    doc[record.key.field] = record.key.value;

    await this.client.initIndex(index).partialUpdateObject(doc);
  }
  async delete({ index, key }) {
    await this.client.initIndex(index).deleteObject(key.value);
  }
  async createMany({ index, records }) {
    await this.client.initIndex(index).saveObjects(records);
  }
  async updateMany({ index, records }) {
    await this.client.initIndex(index).partialUpdateObjects(records);
  }
  async deleteMany({ index, keys }) {
    const docIds = keys.map((k) => k.value);
    await this.client.initIndex(index).deleteObjects(docIds);
  }
}
