import { Connection, createConnection } from 'mysql2/promise';
import {
	AddCheckConstraintToColumnInterface,
	AddColumnInterface,
	AddDefaultValueInterface,
	AddForeignKeyInterface,
	AddNotNullToColumnInterface,
	AddPrimaryGeneratedColumnInterface,
	AddUniqueToColumnInterface,
	ChangeColumnDatatypeInterface,
	CheckTableExistenceOptionsInterface,
	CreateMigrationTableOptionsInterface,
	CreatePreventUpdateNameSubroutineOptionsInterface,
	CreatePreventUpdateNameTriggerOptions,
	CreateTableOptionsInterface,
	DatabaseIngotInterface,
	DataSourceInterface,
	DeleteCheckConstraintOfColumnInterface,
	DeleteColumnInterface,
	DeleteUniqueFromColumnInterface,
	DropConstraintInterface,
	DropDefaultValueInterface,
	DropNotNullFromColumnInterface,
	DropTableInterface,
	GetCurrentDatabaseIngotOptionsInterface,
	InitCurrentDatabaseIngotOptionsInterface,
	RenameColumnInterface,
	RenameTableInterface,
	SyncDatabaseIngotOptionsInterface
} from '@core/interfaces';
import { ConditionParamsType, ConnectionData, JoinCondition, OrderOperators } from '@core/types';
import {
	ActiveConnectionsInterface,
	CpuUsageInterface,
	DiskUsageInterface,
	MemoryUsageInterface,
	MigrationServiceInterface,
	TableAltererInterface,
	TableBuilderInterface,
	WaitingConnectionsInterface
} from '@strategies/mysql/interfaces';
import {
	AggregateQueries,
	DeleteQueries,
	InsertQueries,
	MigrationService,
	SelectQueries,
	StructureQueries,
	TableAlterer,
	TableBuilder,
	Transaction,
	UpdateQueries,
	ViewQueries
} from '@strategies/mysql/components';
import { BaseQueries } from '@strategies/base-queries';
import { AddComputedColumnInterface } from '@core/interfaces/table-manipulation/add-computed-column.interface';
import { DatabasesTypes } from '@core/enums';
import { Monitoring, MonitoringInterface, TransactionInterface } from '@strategies/mysql';
import {
	AggregateQueriesInterface,
	DeleteQueriesInterface,
	InsertQueriesInterface,
	SelectQueriesInterface,
	StructureQueriesInterface,
	UpdateQueriesInterface,
	ViewQueriesInterface
} from '@strategies/common';

export class DataSourceMySql extends BaseQueries implements DataSourceInterface<DatabasesTypes.MYSQL> {
	client: Connection;
	private _tableBuilder: TableBuilderInterface;
	private _tableAlterer: TableAltererInterface;
	private _migrationService: MigrationServiceInterface;
	private _insertQueries: InsertQueriesInterface;
	private _updateQueries: UpdateQueriesInterface;
	private _deleteQueries: DeleteQueriesInterface;
	private _selectQueries: SelectQueriesInterface;
	private _aggregateQueries: AggregateQueriesInterface;
	private _structureQueries: StructureQueriesInterface;
	private _viewQueries: ViewQueriesInterface;
	private _transaction: TransactionInterface;
	private _monitoring: MonitoringInterface<DatabasesTypes.MYSQL>;

	constructor() {
		super();
		this._tableBuilder = new TableBuilder();
		this._tableAlterer = new TableAlterer();
		this._migrationService = new MigrationService();
		this._insertQueries = new InsertQueries();
		this._updateQueries = new UpdateQueries();
		this._deleteQueries = new DeleteQueries();
		this._selectQueries = new SelectQueries();
		this._aggregateQueries = new AggregateQueries();
		this._structureQueries = new StructureQueries();
		this._viewQueries = new ViewQueries();
		this._transaction = new Transaction();
		this._monitoring = new Monitoring();
	}

	async connect(dataToConnect: ConnectionData): Promise<void> {
		this.client = await createConnection({ ...dataToConnect, multipleStatements: true });
	}

	createTable(options: CreateTableOptionsInterface<DatabasesTypes.MYSQL>): string {
		return this._tableBuilder.createTable(
			options?.table,
			options?.columns,
			options?.computedColumns,
			options?.foreignKeys,
			options?.primaryColumn,
			options?.oneToOne,
			options?.oneToMany
		);
	}

	createMigrationTable(options: CreateMigrationTableOptionsInterface): string {
		return this._migrationService.createMigrationTable(options);
	}

	createPreventUpdateNameSubroutine(options: CreatePreventUpdateNameSubroutineOptionsInterface): string {
		return this._migrationService.createPreventUpdateNameSubroutine(options);
	}

	createPreventUpdateNameTrigger(options: CreatePreventUpdateNameTriggerOptions): string {
		return this._migrationService.createPreventUpdateNameTrigger(options);
	}

	checkTableExistence(options: CheckTableExistenceOptionsInterface<DatabasesTypes.MYSQL>): Promise<boolean> {
		return this._migrationService.checkTableExistence(options);
	}

	initCurrentDatabaseIngot(options: InitCurrentDatabaseIngotOptionsInterface<DatabasesTypes.MYSQL>): Promise<void> {
		return this._migrationService.initCurrentDatabaseIngot(options);
	}

	syncDatabaseIngot(options: SyncDatabaseIngotOptionsInterface<DatabasesTypes.MYSQL>): Promise<void> {
		return this._migrationService.syncDatabaseIngot(options);
	}

	getCurrentDatabaseIngot(options: GetCurrentDatabaseIngotOptionsInterface<DatabasesTypes.MYSQL>): Promise<DatabaseIngotInterface<DatabasesTypes.MYSQL>> {
		return this._migrationService.getCurrentDatabaseIngot(options);
	}

	//table manipulation
	addColumn(tableName: string, parameters: AddColumnInterface<DatabasesTypes.MYSQL>): string {
		return this._tableAlterer.addColumn(tableName, parameters);
	}

	deleteColumn(tableName: string, parameters: DeleteColumnInterface<DatabasesTypes.MYSQL>): string {
		return this._tableAlterer.deleteColumn(tableName, parameters);
	}

	addNotNullToColumn(tableName: string, parameters: AddNotNullToColumnInterface): string {
		return this._tableAlterer.addNotNullToColumn(tableName, parameters);
	}

	dropNotNullFromColumn(tableName: string, parameters: DropNotNullFromColumnInterface): string {
		return this._tableAlterer.dropNotNullFromColumn(tableName, parameters);
	}

	addUniqueToColumn(tableName: string, parameters: AddUniqueToColumnInterface<DatabasesTypes.MYSQL>): string {
		return this._tableAlterer.addUniqueToColumn(tableName, parameters);
	}

	addCheckConstraintToColumn(tableName: string, parameters: AddCheckConstraintToColumnInterface): string {
		return this._tableAlterer.addCheckConstraintToColumn(tableName, parameters);
	}

	deleteCheckConstraintOfColumn(tableName: string, parameters: DeleteCheckConstraintOfColumnInterface): string {
		return this._tableAlterer.deleteCheckConstraintOfColumn(tableName, parameters);
	}

	dropConstraint(tableName: string, parameters: DropConstraintInterface): string {
		return this._tableAlterer.dropConstraint(tableName, parameters);
	}

	deleteUniqueFromColum(tableName: string, parameters: DeleteUniqueFromColumnInterface): string {
		return this._tableAlterer.deleteUniqueFromColum(tableName, parameters);
	}

	changeDataTypeOfColumn(tableName: string, parameters: ChangeColumnDatatypeInterface): string {
		return this._tableAlterer.changeDataTypeOfColumn(tableName, parameters);
	}

	addPrimaryGeneratedColumn(tableName: string, parameters: AddPrimaryGeneratedColumnInterface<DatabasesTypes.MYSQL>): string {
		return this._tableAlterer.addPrimaryGeneratedColumn(tableName, parameters);
	}

	addForeignKey(tableName: string, parameters: AddForeignKeyInterface): string {
		return this._tableAlterer.addForeignKey(tableName, parameters);
	}

	addComputedColumn(tableName: string, parameters: AddComputedColumnInterface<DatabasesTypes.MYSQL>): string {
		return this._tableAlterer.addComputedColumn(tableName, parameters);
	}

	dropTable(tableName: string, parameters: DropTableInterface<DatabasesTypes.MYSQL>): string {
		return this._tableAlterer.dropTable(tableName, parameters);
	}

	addDefaultValue(tableName: string, parameters: AddDefaultValueInterface): string {
		return this._tableAlterer.addDefaultValue(tableName, parameters);
	}

	dropDefaultValue(tableName: string, parameters: DropDefaultValueInterface): string {
		return this._tableAlterer.dropDefaultValue(tableName, parameters);
	}

	renameColumn(tableName: string, parameters: RenameColumnInterface): string {
		return this._tableAlterer.renameColumn(tableName, parameters);
	}

	renameTable(tableName: string, parameters: RenameTableInterface): string {
		return this._tableAlterer.renameTable(tableName, parameters);
	}

	//get time
	getCurrentTimestamp(): string {
		return 'SELECT NOW();';
	}

	//Select queries
	where(params: ConditionParamsType): string {
		return this._selectQueries.where(params);
	}

	innerJoin(table: string, condition: JoinCondition): string {
		return this._selectQueries.innerJoin(table, condition);
	}

	leftJoin(table: string, condition: JoinCondition): string {
		return this._selectQueries.leftJoin(table, condition);
	}

	rightJoin(table: string, condition: JoinCondition): string {
		return this._selectQueries.rightJoin(table, condition);
	}

	select(columns: string[]): string {
		return this._selectQueries.select(columns);
	}

	orderBy(column: string, order: OrderOperators): string {
		return this._selectQueries.orderBy(column, order);
	}

	as(alias: string): string {
		return this._selectQueries.as(alias);
	}

	//Aggregate queries
	having(params: ConditionParamsType): string {
		return this._aggregateQueries.having(params);
	}

	summing(column: string): string {
		return this._aggregateQueries.summing(column);
	}

	counting(column: string): string {
		return this._aggregateQueries.counting(column);
	}

	groupBy(columns: string[]): string {
		return this._aggregateQueries.groupBy(columns);
	}

	//Insert queries
	insert(values: Partial<unknown>, tableName: string): string {
		return this._insertQueries.insert(values, tableName);
	}

	insertMany(values: Partial<unknown>[], tableName: string): string {
		return this._insertQueries.insertMany(values, tableName);
	}

	setInto(name: string): string {
		return this._insertQueries.setInto(name);
	}

	//Structure queries
	from(table: string): string {
		return this._structureQueries.from(table);
	}

	//Update queries
	update(values: Partial<Object>, tableName: string): string {
		return this._updateQueries.update(values, tableName);
	}

	//Delete queries
	deleting(tableName: string): string {
		return this._deleteQueries.deleting(tableName);
	}

	//Base queries
	createView(name: string): string {
		return this._viewQueries.createView(name);
	}

	//Transaction
	async beginTransaction(dataSource: DataSourceInterface<DatabasesTypes.MYSQL>): Promise<void> {
		return this._transaction.beginTransaction(dataSource);
	}

	async commit(dataSource: DataSourceInterface<DatabasesTypes.MYSQL>): Promise<void> {
		return this._transaction.commit(dataSource);
	}

	async rollback(dataSource: DataSourceInterface<DatabasesTypes.MYSQL>): Promise<void> {
		return this._transaction.rollback(dataSource);
	}

	//Monitoring
	async getCPUUsage(dataSource: DataSourceInterface<DatabasesTypes.MYSQL>): Promise<CpuUsageInterface[]> {
		return this._monitoring.getCPUUsage(dataSource);
	}

	async getMemoryUsage(dataSource: DataSourceInterface<DatabasesTypes.MYSQL>): Promise<MemoryUsageInterface[]> {
		return this._monitoring.getMemoryUsage(dataSource);
	}

	async getDiskUsage(dataSource: DataSourceInterface<DatabasesTypes.MYSQL>): Promise<DiskUsageInterface[]> {
		return this._monitoring.getDiskUsage(dataSource);
	}

	async getActiveConnections(dataSource: DataSourceInterface<DatabasesTypes.MYSQL>): Promise<ActiveConnectionsInterface> {
		return this._monitoring.getActiveConnections(dataSource);
	}

	async getWaitingConnections(dataSource: DataSourceInterface<DatabasesTypes.MYSQL>): Promise<WaitingConnectionsInterface> {
		return this._monitoring.getWaitingConnections(dataSource);
	}
}