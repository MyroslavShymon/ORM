import { BaseStructureQueriesInterface } from '@strategies/common';
import { QueryBuilderInterface } from '@context/interfaces';

export class BaseStructureQueries implements BaseStructureQueriesInterface {
	from(table: string): string {
		return `FROM ${table} \n`;
	}

	union(queryBuilder: QueryBuilderInterface<Object>): string {
		return `UNION \n ${queryBuilder.build()} \n`;
	}

	unionAll(queryBuilder: QueryBuilderInterface<Object>): string {
		return `UNION ALL \n ${queryBuilder.build()} \n`;
	}

}