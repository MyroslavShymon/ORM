import { ConditionParamsType, ConnectionData, JoinCondition, OrderOperators } from '@core/types';
import { AddColumnInterface } from '@core/interfaces/table-manipulation/add-column.interface';
import { DatabaseIngotInterface } from '@core/interfaces/database-ingot.interface';
import {
	AddCheckConstraintToColumnInterface,
	AddDefaultValueInterface,
	AddForeignKeyInterface,
	AddNotNullToColumnInterface,
	AddPrimaryGeneratedColumnInterface,
	AddUniqueToColumnInterface,
	ChangeColumnDatatypeInterface,
	DeleteCheckConstraintOfColumnInterface,
	DeleteColumnInterface,
	DeleteUniqueFromColumnInterface,
	DropConstraintInterface,
	DropDefaultValueInterface,
	DropNotNullFromColumnInterface,
	DropTableInterface,
	RenameColumnInterface,
	RenameTableInterface
} from '@core/interfaces/table-manipulation';
import { QueryBuilderInterface } from '@context/common';
import { AddComputedColumnInterface } from '@core/interfaces/table-manipulation/add-computed-column.interface';
import { DatabasesTypes } from '@core/enums';
import {
	CheckTableExistenceOptionsInterface,
	CreateMigrationTableOptionsInterface,
	CreatePreventUpdateNameSubroutineOptionsInterface,
	CreatePreventUpdateNameTriggerOptions,
	GetCurrentDatabaseIngotOptionsInterface,
	InitCurrentDatabaseIngotOptionsInterface,
	SyncDatabaseIngotOptionsInterface
} from '@core/interfaces/migration-service';
import { SqlClientInterface } from '@core/interfaces/sql-client.interface';
import { CreateTableOptionsInterface } from '@core/interfaces/create-table';
import {
	ActiveConnectionsInterface,
	CpuUsageInterface,
	DiskUsageInterface,
	MemoryUsageInterface,
	WaitingConnectionsInterface
} from '@strategies/mysql';

export interface DataSourceInterface<DT extends DatabasesTypes> {
	client: SqlClientInterface;

	connect(dataToConnect: ConnectionData);

	createTable(options: CreateTableOptionsInterface<DT>): string;

	addColumn(tableName: string, parameters: AddColumnInterface<DT>): string;

	deleteColumn(tableName: string, parameters: DeleteColumnInterface<DT>): string;

	addNotNullToColumn(tableName: string, parameters: AddNotNullToColumnInterface): string;

	dropNotNullFromColumn(tableName: string, parameters: DropNotNullFromColumnInterface): string;

	addUniqueToColumn(tableName: string, parameters: AddUniqueToColumnInterface<DT>): string;

	changeDataTypeOfColumn(tableName: string, parameters: ChangeColumnDatatypeInterface): string;

	addDefaultValue(tableName: string, parameters: AddDefaultValueInterface): string;

	dropDefaultValue(tableName: string, parameters: DropDefaultValueInterface): string;

	addCheckConstraintToColumn(tableName: string, parameters: AddCheckConstraintToColumnInterface): string;

	deleteCheckConstraintOfColumn(tableName: string, parameters: DeleteCheckConstraintOfColumnInterface): string;

	dropConstraint(tableName: string, parameters: DropConstraintInterface): string;

	deleteUniqueFromColum(tableName: string, parameters: DeleteUniqueFromColumnInterface): string;

	addPrimaryGeneratedColumn(tableName: string, parameters: AddPrimaryGeneratedColumnInterface<DT>): string;

	addForeignKey(tableName: string, parameters: AddForeignKeyInterface): string;

	addComputedColumn(tableName: string, parameters: AddComputedColumnInterface<DT>): string;

	renameColumn(tableName: string, parameters: RenameColumnInterface): string;

	renameTable(tableName: string, parameters: RenameTableInterface): string;

	dropTable(tableName: string, parameters: DropTableInterface<DT>): string;

	// migration service
	createMigrationTable(options: CreateMigrationTableOptionsInterface): string;

	createPreventUpdateNameSubroutine(options: CreatePreventUpdateNameSubroutineOptionsInterface): string;

	createPreventUpdateNameTrigger(options: CreatePreventUpdateNameTriggerOptions): string;

	checkTableExistence(options: CheckTableExistenceOptionsInterface<DT>): Promise<boolean>;

	initCurrentDatabaseIngot(options: InitCurrentDatabaseIngotOptionsInterface<DT>): Promise<void>;

	syncDatabaseIngot(options: SyncDatabaseIngotOptionsInterface<DT>): Promise<void>;

	getCurrentDatabaseIngot(options: GetCurrentDatabaseIngotOptionsInterface<DT>): Promise<DatabaseIngotInterface<DT>>;

	//get time
	getCurrentTimestamp(): string;

	//Select querying
	select(columns: string[]): string;

	orderBy(column: string, order: OrderOperators): string;

	as(alias: string): string;

	limit(count: number): string;

	innerJoin(table: string, condition: JoinCondition): string;

	leftJoin(table: string, condition: JoinCondition): string;

	rightJoin(table: string, condition: JoinCondition): string;

	where(params: ConditionParamsType): string;

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

	having(params: ConditionParamsType): string;

	groupBy(columns: string[]): string;

	//Transaction
	beginTransaction(dataSource: DataSourceInterface<DT>): Promise<void>;

	commit(dataSource: DataSourceInterface<DT>): Promise<void>;

	rollback(dataSource: DataSourceInterface<DT>): Promise<void>;

	//Monitoring
	getCPUUsage(dataSource: DataSourceInterface<DT>): Promise<DT extends DatabasesTypes.MYSQL ? CpuUsageInterface[] : unknown>;

	getMemoryUsage(dataSource: DataSourceInterface<DT>): Promise<DT extends DatabasesTypes.MYSQL ? MemoryUsageInterface[] : unknown>;

	getDiskUsage(dataSource: DataSourceInterface<DT>): Promise<DT extends DatabasesTypes.MYSQL ? DiskUsageInterface[] : unknown>;

	getActiveConnections(dataSource: DataSourceInterface<DT>): Promise<DT extends DatabasesTypes.MYSQL ? ActiveConnectionsInterface : unknown>;

	getWaitingConnections(dataSource: DataSourceInterface<DT>): Promise<DT extends DatabasesTypes.MYSQL ? WaitingConnectionsInterface : unknown>;
}
