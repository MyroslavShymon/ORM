import { ConnectionData } from '@core/types';
import { ColumnInterface, ComputedColumnInterface, TableInterface } from '@core/interfaces/decorators';
import { AddColumnInterface } from '@core/interfaces/table-manipuldation/add-column.interface';
import {
	TableAltererInterface as TableAltererInterfacePostgres,
	TableBuilderInterface as TableBuilderInterfacePostgres
} from '../../strategies/postgres';
import {
	TableAltererInterface as TableAltererInterfaceMysql,
	TableBuilderInterface as TableBuilderInterfaceMysql
} from '../../strategies/mysql';
import { DatabaseIngotInterface } from '@core/interfaces/database-ingot.interface';
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
import { ForeignKeyInterface, PrimaryGeneratedColumnInterface } from '@decorators/postgres';
import { Condition, LogicalOperators, OrderOperators } from '@context/types';
import { QueryBuilderInterface } from '@context/interfaces';

export interface DataSourceInterface {
	client;//TODO typing
	tableBuilder: TableBuilderInterfacePostgres | TableBuilderInterfaceMysql;
	tableAlterer: TableAltererInterfacePostgres | TableAltererInterfaceMysql;

	connect(dataToConnect: ConnectionData);

	createTable(
		table?: TableInterface<DataSourceInterface>,
		columns?: ColumnInterface<DataSourceInterface>[],
		computedColumns?: ComputedColumnInterface<DataSourceInterface>[],
		foreignKeys?: ForeignKeyInterface[],
		primaryColumn?: PrimaryGeneratedColumnInterface
	): string;

	addColumn(tableName: string, parameters: AddColumnInterface<DataSourceInterface>): string;

	deleteColumn(tableName: string, parameters: DeleteColumnInterface): string;

	addDefaultValue(tableName: string, parameters: AddDefaultValueInterface): string;

	dropDefaultValue(tableName: string, parameters: DropDefaultValueInterface): string;

	changeDataTypeOfColumn(tableName: string, parameters: ChangeColumnDatatypeInterface): string;

	renameColumn(tableName: string, parameters: RenameColumnInterface): string;

	renameTable(tableName: string, parameters: RenameTableInterface): string;

	addNotNullToColumn(tableName: string, parameters: AddNotNullToColumnInterface): string;

	dropNotNullFromColumn(tableName: string, parameters: DropNotNullFromColumnInterface): string;

	addUniqueToColumn(tableName: string, parameters: AddUniqueToColumnInterface): string;

	dropTable(tableName: string, parameters: DropTableInterface): string;

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
