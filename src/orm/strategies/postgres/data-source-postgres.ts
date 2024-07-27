import { Pool, PoolClient } from 'pg';
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
	AggregateQueries,
	AggregateQueriesInterface,
	DeleteQueriesInterface,
	InsertQueriesInterface,
	MigrationServiceInterface,
	SelectQueriesInterface,
	TableAltererInterface,
	TableBuilderInterface,
	Transaction,
	TransactionInterface,
	UpdateQueriesInterface,
	ViewQueriesInterface
} from '@strategies/postgres';
import {
	DeleteQueries,
	InsertQueries,
	MigrationService,
	SelectQueries,
	TableAlterer,
	TableBuilder,
	UpdateQueries,
	ViewQueries
} from '@strategies/postgres/components';
import { BaseQueries } from '@strategies/base-queries';
import { AddComputedColumnInterface } from '@core/interfaces/table-manipulation/add-computed-column.interface';
import { DatabasesTypes } from '@core/enums';
import { StructureQueries, StructureQueriesInterface } from '@strategies/mysql';

export class DataSourcePostgres extends BaseQueries implements DataSourceInterface<DatabasesTypes.POSTGRES> {
	client: PoolClient;
	private _tableBuilder: TableBuilderInterface;
	private _tableAlterer: TableAltererInterface;
	private _migrationService: MigrationServiceInterface;
	private _selectQueries: SelectQueriesInterface;
	private _insertQueries: InsertQueriesInterface;
	private _updateQueries: UpdateQueriesInterface;
	private _deleteQueries: DeleteQueriesInterface;
	private _aggregateQueries: AggregateQueriesInterface;
	private _structureQueries: StructureQueriesInterface;
	private _viewQueries: ViewQueriesInterface;
	private _transaction: TransactionInterface;

	constructor() {
		super();
		this._migrationService = new MigrationService();
		this._tableBuilder = new TableBuilder();
		this._tableAlterer = new TableAlterer();
		this._selectQueries = new SelectQueries();
		this._insertQueries = new InsertQueries();
		this._updateQueries = new UpdateQueries();
		this._deleteQueries = new DeleteQueries();
		this._aggregateQueries = new AggregateQueries();
		this._structureQueries = new StructureQueries();
		this._viewQueries = new ViewQueries();
		this._transaction = new Transaction();
	}

	async connect(dataToConnect: ConnectionData): Promise<void> {
		const pool = new Pool(dataToConnect);
		this.client = await pool.connect();
	}

	createTable(options: CreateTableOptionsInterface<DatabasesTypes.POSTGRES>): string {
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

	checkTableExistence(options: CheckTableExistenceOptionsInterface<DatabasesTypes.POSTGRES>): Promise<boolean> {
		return this._migrationService.checkTableExistence(options);
	}

	initCurrentDatabaseIngot(options: InitCurrentDatabaseIngotOptionsInterface<DatabasesTypes.POSTGRES>): Promise<void> {
		return this._migrationService.initCurrentDatabaseIngot(options);
	}

	syncDatabaseIngot(options: SyncDatabaseIngotOptionsInterface<DatabasesTypes.POSTGRES>): Promise<void> {
		return this._migrationService.syncDatabaseIngot(options);
	}

	getCurrentDatabaseIngot(options: GetCurrentDatabaseIngotOptionsInterface<DatabasesTypes.POSTGRES>): Promise<DatabaseIngotInterface<DatabasesTypes.POSTGRES>> {
		return this._migrationService.getCurrentDatabaseIngot(options);
	}

	//Base table manipulation queries
	addColumn(tableName: string, parameters: AddColumnInterface<DatabasesTypes.POSTGRES>): string {
		return this._tableAlterer.addColumn(tableName, parameters);
	}

	deleteColumn(tableName: string, parameters: DeleteColumnInterface<DatabasesTypes.POSTGRES>): string {
		return this._tableAlterer.deleteColumn(tableName, parameters);
	}

	addNotNullToColumn(tableName: string, parameters: AddNotNullToColumnInterface): string {
		return this._tableAlterer.addNotNullToColumn(tableName, parameters);
	}

	dropNotNullFromColumn(tableName: string, parameters: DropNotNullFromColumnInterface): string {
		return this._tableAlterer.dropNotNullFromColumn(tableName, parameters);
	}

	addUniqueToColumn(tableName: string, parameters: AddUniqueToColumnInterface<DatabasesTypes.POSTGRES>): string {
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

	addPrimaryGeneratedColumn(tableName: string, parameters: AddPrimaryGeneratedColumnInterface<DatabasesTypes.POSTGRES>): string {
		return this._tableAlterer.addPrimaryGeneratedColumn(tableName, parameters);
	}

	addForeignKey(tableName: string, parameters: AddForeignKeyInterface): string {
		return this._tableAlterer.addForeignKey(tableName, parameters);
	}

	addComputedColumn(tableName: string, parameters: AddComputedColumnInterface<DatabasesTypes.POSTGRES>): string {
		return this._tableAlterer.addComputedColumn(tableName, parameters);
	}

	dropTable(tableName: string, parameters: DropTableInterface<DatabasesTypes.POSTGRES>): string {
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


	//Get current time
	getCurrentTimestamp(): string {
		return 'SELECT current_timestamp;';
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
	async beginTransaction(dataSource: DataSourceInterface<DatabasesTypes.POSTGRES>): Promise<void> {
		return this._transaction.beginTransaction(dataSource);
	}

	async commit(dataSource: DataSourceInterface<DatabasesTypes.POSTGRES>): Promise<void> {
		return this._transaction.commit(dataSource);
	}

	async rollback(dataSource: DataSourceInterface<DatabasesTypes.POSTGRES>): Promise<void> {
		return this._transaction.rollback(dataSource);
	}
}