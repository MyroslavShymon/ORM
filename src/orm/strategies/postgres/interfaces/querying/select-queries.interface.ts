import { Condition, LogicalOperators } from '@context/types';

export interface SelectQueriesInterface {
	where(params: {
		conditions?: Condition;
		logicalOperator?: LogicalOperators;
		exists?: string
	} | string): string;
}