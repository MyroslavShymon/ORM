import { OrderOperators } from '@core/types';

export interface BaseSelectQueriesInterface {
	select(columns: string[]): string;

	orderBy(column: string, order: OrderOperators): string;

	as(alias: string): string;

	limit(count: number): string;
}