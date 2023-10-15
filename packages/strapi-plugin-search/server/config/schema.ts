import { z } from "zod";

const Field = z.object({
  name:  z.string(),
  alias:  z.string().optional(),
  custom:z.boolean().optional(),
  value: z.union([z.string(),z.function()]).optional(),
});

const ContentTypeIndex = z.object({
  name: z.string(),
  prefix: z.string().optional(),
  engine:z.string().optional(),
	fields: z.array(Field).optional(),
})

const ContentType = z.object({
  uid: z.string(),
	enabled: z.boolean().optional(),
  indexes: z.array(ContentTypeIndex),
});

const plugin = z.object({
	global: z.object({
    index: z.string(),
    engine: z.string(),
    fields : z.array(z.union([
      z.string(),
      Field,
    ])).optional()
  }),
	engines: z.array(
    z.object({
      name:z.string(),
      resolve: z.string().optional(),
      enabled: z.boolean().optional(),
      options: z.record(z.unknown()),
    })
  ).optional(),
	contentTypes: z.array(ContentType),
});

export { plugin };
