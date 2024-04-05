import { Condition, ConnectionData, LogicalOperators, OrderOperators } from '@core/types';
import { ColumnInterface, ComputedColumnInterface, TableInterface } from '@core/interfaces/decorators';
import { AddColumnInterface } from '@core/interfaces/table-manipuldation/add-column.interface';
import { DatabaseIngotInterface } from '@core/interfaces/database-ingot.interface';
import { ForeignKeyInterface, PrimaryGeneratedColumnInterface } from '@decorators/index';
import {
	AddDefaultValueInterface,
	AddNotNullToColumnInterface,
	AddUniqueToColumnInterface,
	ChangeColumnDatatypeInterface,
	DeleteColumnInterface,
	DropDefaultValueInterface,
	DropNotNullFromColumnInterface,
	DropTableInterface,
	RenameColumnInterface,
	RenameTableInterface
} from '@core/interfaces/table-manipuldation';
import { QueryBuilderInterface } from '@context/common';

export interface DataSourceInterface {
	client;//TODO typing

	connect(dataToConnect: ConnectionData);

	createTable(
		table?: TableInterface<DataSourceInterface>,
		columns?: ColumnInterface[],
		computedColumns?: ComputedColumnInterface<DataSourceInterface>[],
		foreignKeys?: ForeignKeyInterface[],
		primaryColumn?: PrimaryGeneratedColumnInterface
	): string;

	addColumn(tableName: string, parameters: AddColumnInterface): string;

	deleteColumn(tableName: string, parameters: DeleteColumnInterface<DataSourceInterface>): string;

	addNotNullToColumn(tableName: string, parameters: AddNotNullToColumnInterface<DataSourceInterface>): string;

	dropNotNullFromColumn(tableName: string, parameters: DropNotNullFromColumnInterface<DataSourceInterface>): string;

	addUniqueToColumn(tableName: string, parameters: AddUniqueToColumnInterface<DataSourceInterface>): string;

	changeDataTypeOfColumn(tableName: string, parameters: ChangeColumnDatatypeInterface): string;

	addDefaultValue(tableName: string, parameters: AddDefaultValueInterface): string;

	dropDefaultValue(tableName: string, parameters: DropDefaultValueInterface): string;

	renameColumn(tableName: string, parameters: RenameColumnInterface): string;

	renameTable(tableName: string, parameters: RenameTableInterface): string;

	dropTable(tableName: string, parameters: DropTableInterface): string;

	// migration service
	createMigrationTable(tableName: string, tableSchema: string): string;

	checkTableExistence(dataSource: DataSourceInterface, tableName: string, tableSchema: string): Promise<boolean>;

	initCurrentDatabaseIngot(
		dataSource: DataSourceInterface,
		tableName: string,
		tableSchema: string,
		databaseIngot: DatabaseIngotInterface
	): Promise<void>;

	syncDatabaseIngot(
		dataSource: DataSourceInterface,
		tableName: string,
		tableSchema: string,
		databaseIngot: DatabaseIngotInterface
	): Promise<void>;

	getCurrentDatabaseIngot(
		dataSource: DataSourceInterface,
		tableName: string,
		tableSchema: string
	): Promise<DatabaseIngotInterface>;

	//get time
	getCurrentTimestamp(): string;

	//Select querying
	select(columns: string[]): string;

	orderBy(column: string, order: OrderOperators): string;

	as(alias: string): string;

	limit(count: number): string;

	innerJoin(table: string, condition: string): string;

	leftJoin(table: string, condition: string): string;

	rightJoin(table: string, condition: string): string;

	where(params: {
		conditions?: Condition;
		logicalOperator?: LogicalOperators;
		exists?: string
	} | string): string;

	//Insert querying
	setInto(name: string): string;

	insert(values: Partial<unknown>, tableName: string): string;

	insertMany(values: Partial<unknown>[], tableName: string): string;

	//Update querying
	update(values: Partial<Object>, tableName: string): string;

	//Delete querying
	deleting(tableName: string): string;

	//Base querying
	from(table: string): string;

	union(queryBuilder: QueryBuilderInterface<Object>): string;

	unionAll(queryBuilder: QueryBuilderInterface<Object>): string;

	createView(name: string): string;

	//Aggregate querying
	summing(column: string): string;

	counting(column: string): string;

	having(condition: string): string;

	groupBy(columns: string[]): string;
}
