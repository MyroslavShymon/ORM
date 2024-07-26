import {
	BaseAggregateQueries,
	BaseAggregateQueriesInterface,
	BaseDatabaseStructureModifier,
	BaseDatabaseStructureModifierInterface,
	BaseInsertQueries,
	BaseInsertQueriesInterface,
	BaseQueriesInterface,
	BaseSelectQueries,
	BaseSelectQueriesInterface,
	BaseStructureQueries,
	BaseStructureQueriesInterface,
	BaseTableStructureModifier,
	BaseTableStructureModifierInterface
} from '@strategies/common';
import {
	AddDefaultValueInterface,
	DropDefaultValueInterface,
	RenameColumnInterface,
	RenameTableInterface
} from '@core/interfaces';
import { OrderOperators } from '@core/types';
import { QueryBuilderInterface } from '@context/common';


export class BaseQueries implements BaseQueriesInterface {
	private readonly _baseAggregateQueries: BaseAggregateQueriesInterface = new BaseAggregateQueries();
	private readonly _baseInsertQueries: BaseInsertQueriesInterface = new BaseInsertQueries();
	private readonly _baseStructureQueries: BaseStructureQueriesInterface = new BaseStructureQueries();
	private readonly _baseSelectQueries: BaseSelectQueriesInterface = new BaseSelectQueries();
	private readonly _baseTableStructureModifierQueries: BaseTableStructureModifierInterface = new BaseTableStructureModifier();
	private readonly _baseDatabaseStructureModifierQueries: BaseDatabaseStructureModifierInterface = new BaseDatabaseStructureModifier();

	//Base database structure modifier
	renameTable(tableName: string, parameters: RenameTableInterface): string {
		return this._baseDatabaseStructureModifierQueries.renameTable(tableName, parameters);
	}

	//Base table structure modifier
	addDefaultValue(tableName: string, parameters: AddDefaultValueInterface): string {
		return this._baseTableStructureModifierQueries.addDefaultValue(tableName, parameters);
	}

	dropDefaultValue(tableName: string, parameters: DropDefaultValueInterface): string {
		return this._baseTableStructureModifierQueries.dropDefaultValue(tableName, parameters);
	}

	renameColumn(tableName: string, parameters: RenameColumnInterface): string {
		return this._baseTableStructureModifierQueries.renameColumn(tableName, parameters);
	}

	//Base select queries
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
	
	groupBy(columns: string[]): string {
		return this._baseAggregateQueries.groupBy(columns);
	}
}