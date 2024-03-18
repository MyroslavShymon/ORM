import { Condition, LogicalOperators } from '@context/common';

export interface SelectQueriesInterface {
	where(params: {
		conditions?: Condition;
		logicalOperator?: LogicalOperators;
		exists?: string
	} | string): string;
}