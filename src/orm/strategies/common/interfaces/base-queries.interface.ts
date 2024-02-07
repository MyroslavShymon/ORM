import { OrderOperators } from '@context/types';
import { QueryBuilderInterface } from '@context/interfaces';

export interface BaseQueriesInterface {
	//select
	select(columns: string[]): string;

	orderBy(column: string, order: OrderOperators): string;

	as(alias: string): string;

	limit(count: number): string;

	innerJoin(table: string, condition: string): string;

	leftJoin(table: string, condition: string): string;

	rightJoin(table: string, condition: string): string;

	//insert
	setInto(name: string): string;

	//query structure builder
	from(table: string): string;

	union(queryBuilder: QueryBuilderInterface<Object>): string;

	unionAll(queryBuilder: QueryBuilderInterface<Object>): string;

	//aggregate
	summing(column: string): string;

	counting(column: string): string;

	having(condition: string): string;

	groupBy(columns: string[]): string;
}