import { ConditionParamsType, JoinCondition, OrderOperators } from '@core/types';

export interface SelectQueryBuilderInterface<T> {
	select(columns: string[]): void;

	orderBy(column: string, order: OrderOperators): void;

	as(alias: string): void;

	limit(count: number): void;

	leftJoin(table: string, condition: JoinCondition): void;

	rightJoin(table: string, condition: JoinCondition): void;

	innerJoin(table: string, condition: JoinCondition): void;

	where(params: ConditionParamsType<T>): void;
}