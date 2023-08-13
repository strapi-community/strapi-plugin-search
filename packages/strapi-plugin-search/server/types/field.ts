export interface Field<T = unknown> {
	name: string;
	include?: boolean;
	alias?: string;
	custom?: boolean;
	value?: T | (({ record }) => T | Promise<T>);
}
