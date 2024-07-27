import {
	BaseQueriesInterface,
	BaseSelectQueries,
	BaseSelectQueriesInterface,
	BaseStructureQueries,
	BaseStructureQueriesInterface
} from '@strategies/common';
import { QueryBuilderInterface } from '@context/common';


export class BaseQueries implements BaseQueriesInterface {
	private readonly _baseStructureQueries: BaseStructureQueriesInterface = new BaseStructureQueries();
	private readonly _baseSelectQueries: BaseSelectQueriesInterface = new BaseSelectQueries();

	//Base select queries
	limit(count: number): string {
		return this._baseSelectQueries.limit(count);
	}

	//query structure builder
	union(queryBuilder: QueryBuilderInterface<Object>): string {
		return this._baseStructureQueries.union(queryBuilder);
	}

	unionAll(queryBuilder: QueryBuilderInterface<Object>): string {
		return this._baseStructureQueries.unionAll(queryBuilder);
	}
}