import { prefixPluginTranslations } from "@strapi/helper-plugin";

import pluginPkg from "../../package.json";
import pluginId from "./pluginId";
import Initializer from "./components/Initializer";
import getTrad from "./utils/getTrad";

const name = pluginPkg.strapi.name;


interface App {
	registerPlugin: (plugin: Plugin) => void;
	createSettingSection: (
		settingsTitle: SettingsTitle,
		settingsLinks: SettingsLink[]
	) => void;
	locales: string[];
}

interface SettingsTitle {
	id: string;
	intlLabel: {
		id: string;
		defaultMessage: string;
	};
}

interface SettingsLink {
	id: string;
	to: string;
	permissions: string[];
	Component: Promise<Element>;
	intlLabel: {
		id: string;
		defaultMessage: string;
	};
}

interface Plugin {
	id: string;
	initializer: typeof Initializer;
	isReady: boolean;
	name: string;
}

export default {
	
	register(app: App) {
		const plugin = {
			id: pluginId,
			initializer: Initializer,
			isReady: false,
			name,
		};
		app.registerPlugin(plugin);

		app.createSettingSection(
			{
				id: pluginId,
				intlLabel: {
					id: getTrad("Settings.search.link.title"),
					defaultMessage: "Search",
				},
			},
			[
				{
					id: getTrad("Settings.search.link.overview"),
					to: `/settings/${pluginId}/overview`,
					permissions: [],
					Component: (async () => await import("./pages/Overview")) as unknown as Promise<Element>,
					intlLabel: {
						id: getTrad("Settings.search.link.overview"),
						defaultMessage: "Overview",
					},
				},
			]
		);
	},

	bootstrap() {},

	async registerTrads(app: App) {
		const { locales } = app;

		const importedTrads = await Promise.all(
			(locales as unknown[]).map((locale) => {
				return import(`./translations/${locale}.json`)
					.then(({ default: data }) => {
						return {
							data: prefixPluginTranslations(data, pluginId),
							locale,
						};
					})
					.catch(() => {
						return {
							data: {},
							locale,
						};
					});
			})
		);

		return Promise.resolve(importedTrads);
	},
};
