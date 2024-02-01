import { ComparisonOperators } from '@context/types/comparison-operators.type';
// import { LogicalOperators } from '@context/types/logical-operators.type';

// export type Condition<T> = {
// 	[K in keyof T]?: {
// 	[key in ComparisonOperators]?: string | number;
// } & {
// 	[key in LogicalOperators]?: Condition<T> | Array<Condition<T>>;
// };
// };
export type Condition<T> = {
	[K in keyof T]?: {
		[key in ComparisonOperators]?: string | number;
	}
};
