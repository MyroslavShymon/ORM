import { QueryBuilderInterface } from '@context/common';

export interface QueryStructureBuilderInterface<T> {
	from(table: string): void;

	createView(name: string): void;

	//Union
	union(queryBuilder: QueryBuilderInterface<T>): void;

	unionAll(queryBuilder: QueryBuilderInterface<T>): void;
}