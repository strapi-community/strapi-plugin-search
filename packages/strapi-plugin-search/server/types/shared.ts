export type PossibleFunctionArgs<T> = (() => T) | ((args?: any) => T);
export type PossibleFunction<T> = T | PossibleFunctionArgs<T>;
export type PossiblePromise<T> = T | Promise<T>;
