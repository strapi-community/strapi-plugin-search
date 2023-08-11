import type { Strapi } from "@strapi/strapi";
import type { BuilderService, ContentType, EngineService } from "../types";
import { getConfig, getService } from "../utils";

export async function bootstrapLifecyles({ strapi }: { strapi: Strapi }) {
  const defaultEngine = getConfig<string>({ strapi, path: "global.engine" });
  const documentIdField = getConfig<string>({
    strapi,
    path: "global.documentIdField",
  });

  getConfig<ContentType[]>({
    strapi,
    path: "contentTypes",
    defaultValue: [],
  }).forEach((contentType) => {
    if (!contentType.enabled) {
      strapi.log.warn(
        `Skipping lifecycles for ${contentType.uid} as it is disabled`
      );
      return;
    }

    contentType.indexes.forEach((index) => {
      const engine = index.engine || defaultEngine;

      strapi.db.lifecycles.subscribe({
        models: [contentType.uid],
        async afterCreate(event) {
          getService<EngineService>({
            strapi,
            name: "engine",
          }).create({
            uid: contentType.uid,
            engine,
            index: await getService<BuilderService>({
              strapi,
              name: "builder",
            }).index({ index, value: event.result }),
            data: await getService<BuilderService>({
              strapi,
              name: "builder",
            }).data({
              index,
              value: event.result,
            }),
          });
        },
        async beforeUpdate(event) {
          if (event.params.where?.id && event.params.data?.[documentIdField])
            event.state.search.isDocumentIdUpdate = true;
        },
        async afterUpdate(event) {
          if (event.state.search?.isDocumentIdUpdate) return;

          getService<EngineService>({
            strapi,
            name: "engine",
          }).update({
            engine,
            index: await getService<BuilderService>({
              strapi,
              name: "builder",
            }).index({ index, value: event.result }),
            key: getService<BuilderService>({ strapi, name: "builder" }).key({
              value: event.result,
            }),
            data: await getService<BuilderService>({
              strapi,
              name: "builder",
            }).data({
              index,
              value: event.result,
            }),
          });
        },
        async afterDelete(event) {
          getService<EngineService>({
            strapi,
            name: "engine",
          }).delete({
            engine,
            index: await getService<BuilderService>({
              strapi,
              name: "builder",
            }).index({ index, value: event.result }),
            key: getService<BuilderService>({ strapi, name: "builder" }).key({
              value: event.result,
            }),
          });
        },
        async afterCreateMany(event) {
          const query = buildEventQuery({ event });
          if (query.filters) {
            const records = await strapi.entityService.findMany(
              contentType.uid,
              query
            );

            getService<EngineService>({
              strapi,
              name: "engine",
            }).createMany({
              uid: contentType.uid,
              engine,
              index: await getService<BuilderService>({
                strapi,
                name: "builder",
              }).index({ index, value: records }),
              data: await getService<BuilderService>({
                strapi,
                name: "builder",
              }).data({
                index,
                value: records,
              }),
            });
          }
        },
        async beforeUpdateMany(event) {
          const query = buildEventQuery({ event });
          if (query.filters) {
            const records = await strapi.entityService.findMany(
              contentType.uid,
              query
            );

            event.state.search.records = records;
          }
        },
        async afterUpdateMany(event) {
          getService<EngineService>({
            strapi,
            name: "engine",
          }).updateMany({
            engine,
            index: await getService<BuilderService>({
              strapi,
              name: "builder",
            }).index({ index, value: event.state.search?.records }),
            data: await getService<BuilderService>({
              strapi,
              name: "builder",
            }).data({
              index,
              value: event.state.search?.records,
            }),
          });
        },
        async beforeDeleteMany(event) {
          const query = buildEventQuery({ event });
          if (query.filters) {
            const records = await strapi.entityService.findMany(
              contentType.uid,
              query
            );
            event.state.search.documentIds = records?.map(
              (r) => r[documentIdField]
            );
          }
        },
        async afterDeleteMany(event) {
          getService<EngineService>({
            strapi,
            name: "engine",
          }).deleteMany({
            engine,
            index: await getService<BuilderService>({
              strapi,
              name: "builder",
            }).index({ index, value: event.state.search?.documentIds }),
            keys: event.state.search?.documentIds,
          });
        },
      });
    });
  });
}

interface EventQuery {
  filters?: any;
  limit?: number;
  fields?: string[];
}

export function buildEventQuery({ event }) {
  const query: EventQuery = {};

  if (event.params.where) query.filters = event.params.where;

  if (event.result?.count) query.limit = event.result.count;
  else if (event.params.limit) query.limit = event.params.limit;

  if (event.action === "afterCreateMany") {
    query.filters = { id: event.result.ids };
  } else if (event.action === "beforeDeleteMany") {
    const documentIdField = getConfig<string>({
      strapi,
      path: "global.documentIdField",
    });
    query.fields = [documentIdField];
  }

  return query;
}
