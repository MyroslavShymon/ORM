import { ConditionParamsType, JoinCondition, OrderOperators } from '@core/types';

export interface SelectQueriesInterface {
	select(columns: string[]): string;

	orderBy(column: string, order: OrderOperators): string;

	as(alias: string): string;

	innerJoin(table: string, condition: JoinCondition): string;

	leftJoin(table: string, condition: JoinCondition): string;

	rightJoin(table: string, condition: JoinCondition): string;

	where(params: ConditionParamsType): string;
}