import { OrderOperators } from '@context/common';

export interface BaseSelectQueriesInterface {
	select(columns: string[]): string;

	orderBy(column: string, order: OrderOperators): string;

	as(alias: string): string;

	limit(count: number): string;

	innerJoin(table: string, condition: string): string;

	leftJoin(table: string, condition: string): string;

	rightJoin(table: string, condition: string): string;
}