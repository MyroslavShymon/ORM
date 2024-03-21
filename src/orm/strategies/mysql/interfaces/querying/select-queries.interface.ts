import { Condition, LogicalOperators } from '@core/types';

export interface SelectQueriesInterface {
	where(params: {
		conditions?: Condition;
		logicalOperator?: LogicalOperators;
		exists?: string
	} | string): string;
}