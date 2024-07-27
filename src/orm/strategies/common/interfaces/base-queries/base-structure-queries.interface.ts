import { QueryBuilderInterface } from '@context/common';

export interface BaseStructureQueriesInterface {
	union(queryBuilder: QueryBuilderInterface<Object>): string;

	unionAll(queryBuilder: QueryBuilderInterface<Object>): string;
}