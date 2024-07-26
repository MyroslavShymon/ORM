import { ConditionParamsType, JoinCondition } from '@core/types';

export interface SelectQueriesInterface {
	innerJoin(table: string, condition: JoinCondition): string;

	leftJoin(table: string, condition: JoinCondition): string;

	rightJoin(table: string, condition: JoinCondition): string;

	where(params: ConditionParamsType): string;
}