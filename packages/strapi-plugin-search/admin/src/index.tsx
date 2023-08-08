import { prefixPluginTranslations } from "@strapi/helper-plugin";

import pluginPkg from "../../package.json";
import pluginId from "./pluginId";
import Initializer from "./components/Initializer";
import getTrad from "./utils/getTrad";

const name = pluginPkg.strapi.name;

export default {
  register(app: any) {
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
          Component: async () => await import("./pages/Overview"),
          intlLabel: {
            id: getTrad("Settings.search.link.overview"),
            defaultMessage: "Overview",
          },
        },
      ]
    );
  },

  bootstrap(app: any) {},

  async registerTrads(app: any) {
    const { locales } = app;

    const importedTrads = await Promise.all(
      (locales as any[]).map((locale) => {
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
