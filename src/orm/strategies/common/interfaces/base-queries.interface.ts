import { QueryBuilderInterface } from '@context/common';

export interface BaseQueriesInterface {
	//select
	limit(count: number): string;

	//query structure builder
	union(queryBuilder: QueryBuilderInterface<Object>): string;

	unionAll(queryBuilder: QueryBuilderInterface<Object>): string;
}