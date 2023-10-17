import { base, ts } from "@strapi-plugin-search/eslint-config";

export default [...base, ...ts.plugin, ...ts.parser];
