import { Condition, LogicalOperators } from '@core/types';

export type ConditionParamsType<T = unknown> = {
	conditions?: Condition<T>;
	logicalOperator?: LogicalOperators;
	exists?: string;
} | string