import { Condition, LogicalOperators, OrderOperators } from '@core/types';

export interface SelectQueryBuilderInterface<T> {
	select(columns: string[]): void;

	orderBy(column: string, order: OrderOperators): void;

	as(alias: string): void;

	limit(count: number): void;

	leftJoin(table: string, condition: string): void;

	rightJoin(table: string, condition: string): void;

	innerJoin(table: string, condition: string): void;

	where(params: {
		conditions?: Condition<T>,
		logicalOperator?: LogicalOperators,
		exists?: string
	} | string): void;
}