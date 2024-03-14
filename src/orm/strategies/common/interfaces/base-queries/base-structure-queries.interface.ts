import { QueryBuilderInterface } from '@context/common';

export interface BaseStructureQueriesInterface {
	from(table: string): string;

	union(queryBuilder: QueryBuilderInterface<Object>): string;

	unionAll(queryBuilder: QueryBuilderInterface<Object>): string;
}