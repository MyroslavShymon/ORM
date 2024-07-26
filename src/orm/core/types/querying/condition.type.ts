// import { LogicalOperators } from '@context/types/logical-operators.type';

// export type Condition<T> = {
// 	[K in keyof T]?: {
// 	[key in ComparisonOperators]?: string | number;
// } & {
// 	[key in LogicalOperators]?: Condition<T> | Array<Condition<T>>;
// };
// };

import { ComparisonOperators } from '@core/types';

export type Condition<T = unknown> = {
	[K in keyof T]?: {
		[key in ComparisonOperators]?: key extends 'in' ? (string | number | string[] | number[]) : string | number;
	}
};