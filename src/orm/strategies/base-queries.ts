import {
	BaseAggregateQueries,
	BaseAggregateQueriesInterface,
	BaseInsertQueries,
	BaseInsertQueriesInterface,
	BaseQueriesInterface,
	BaseSelectQueries,
	BaseSelectQueriesInterface,
	BaseStructureQueries,
	BaseStructureQueriesInterface
} from '@strategies/common';
import { OrderOperators, QueryBuilderInterface } from '@context/common';


export class BaseQueries implements BaseQueriesInterface {
	private readonly _baseAggregateQueries: BaseAggregateQueriesInterface = new BaseAggregateQueries();
	private readonly _baseInsertQueries: BaseInsertQueriesInterface = new BaseInsertQueries();
	private readonly _baseStructureQueries: BaseStructureQueriesInterface = new BaseStructureQueries();
	private readonly _baseSelectQueries: BaseSelectQueriesInterface = new BaseSelectQueries();

	select(columns: string[]): string {
		return this._baseSelectQueries.select(columns);
	}

	orderBy(column: string, order: OrderOperators): string {
		return this._baseSelectQueries.orderBy(column, order);
	}

	as(alias: string): string {
		return this._baseSelectQueries.as(alias);
	}

	limit(count: number): string {
		return this._baseSelectQueries.limit(count);
	}

	innerJoin(table: string, condition: string): string {
		return this._baseSelectQueries.innerJoin(table, condition);
	}

	leftJoin(table: string, condition: string): string {
		return this._baseSelectQueries.leftJoin(table, condition);
	}

	rightJoin(table: string, condition: string): string {
		return this._baseSelectQueries.rightJoin(table, condition);
	}

	//insert
	setInto(name: string): string {
		return this._baseInsertQueries.setInto(name);
	}

	//query structure builder
	from(table: string): string {
		return this._baseStructureQueries.from(table);
	}

	union(queryBuilder: QueryBuilderInterface<Object>): string {
		return this._baseStructureQueries.union(queryBuilder);
	}

	unionAll(queryBuilder: QueryBuilderInterface<Object>): string {
		return this._baseStructureQueries.unionAll(queryBuilder);
	}

	//aggregate
	summing(column: string): string {
		return this._baseAggregateQueries.summing(column);
	}

	counting(column: string): string {
		return this._baseAggregateQueries.counting(column);
	}

	having(condition: string): string {
		return this._baseAggregateQueries.having(condition);
	}

	groupBy(columns: string[]): string {
		return this._baseAggregateQueries.groupBy(columns);
	}
}