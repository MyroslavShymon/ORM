import { BaseStructureQueriesInterface } from '@strategies/common';
import { QueryBuilderInterface } from '@context/common';

export class BaseStructureQueries implements BaseStructureQueriesInterface {
	union(queryBuilder: QueryBuilderInterface<Object>): string {
		return `UNION \n ${queryBuilder.build()} \n`;
	}

	unionAll(queryBuilder: QueryBuilderInterface<Object>): string {
		return `UNION ALL \n ${queryBuilder.build()} \n`;
	}
}