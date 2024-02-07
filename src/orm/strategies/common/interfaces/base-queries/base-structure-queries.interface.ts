import { QueryBuilderInterface } from '@context/interfaces';

export interface BaseStructureQueriesInterface {
	from(table: string): string;

	union(queryBuilder: QueryBuilderInterface<Object>): string;

	unionAll(queryBuilder: QueryBuilderInterface<Object>): string;
}