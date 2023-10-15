import { PossibleFunction, PossiblePromise } from "./shared";

export interface ComplexField<T = unknown> {
  name: string;
  alias?: string;
  custom?: boolean;
  value?: PossibleFunction<PossiblePromise<T>>;
}

export type Field = string | ComplexField;
