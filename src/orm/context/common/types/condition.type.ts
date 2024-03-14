// import { LogicalOperators } from '@context/types/logical-operators.type';

// export type Condition<T> = {
// 	[K in keyof T]?: {
// 	[key in ComparisonOperators]?: string | number;
// } & {
// 	[key in LogicalOperators]?: Condition<T> | Array<Condition<T>>;
// };
// };
import { ComparisonOperators } from '@context/common';

export type Condition<T = unknown> = {
	[K in keyof T]?: {
		[key in ComparisonOperators]?: string | number;
	}
};