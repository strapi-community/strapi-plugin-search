import { plugin } from "./schema";

export default {
	default() {
		return {
			global: {},
			engines: [],
			contentTypes: [],
		};
	},
	validator(config) {
		plugin.parse(config);
	},
};
