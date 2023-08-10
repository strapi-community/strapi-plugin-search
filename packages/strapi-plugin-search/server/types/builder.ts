import type { ContentTypeIndex } from "./content-type";

export interface BuilderServiceIndexParams {
  index: ContentTypeIndex;
  value: Record<string, unknown> | Record<string, unknown>[];
}

export interface BuilderServiceKeyParams {
  value: Record<string, unknown>;
}

export interface BuilderServiceDataParams {
  index: ContentTypeIndex;
  value: Record<string, unknown>;
}

export interface BuilderService {
  index({ index, value }: BuilderServiceIndexParams): string | Promise<string>;
  key({ value }: BuilderServiceKeyParams): string;
  data({
    index,
    value,
  }: BuilderServiceIndexParams): Promise<
    Record<string, unknown> | Record<string, unknown>[]
  >;
}
