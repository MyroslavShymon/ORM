import { Pool, PoolClient } from 'pg';
import {
	AddCheckConstraintToColumnInterface,
	AddColumnInterface,
	AddForeignKeyInterface,
	AddNotNullToColumnInterface,
	AddPrimaryGeneratedColumnInterface,
	AddUniqueToColumnInterface,
	ChangeColumnDatatypeInterface,
	CreateTableOptionsInterface,
	DatabaseIngotInterface,
	DataSourceInterface,
	DeleteCheckConstraintOfColumnInterface,
	DeleteColumnInterface,
	DeleteUniqueFromColumnInterface,
	DropConstraintInterface,
	DropNotNullFromColumnInterface
} from '@core/interfaces';
import { Condition, ConnectionData, LogicalOperators } from '@core/types';
import {
	DeleteQueriesInterface,
	InsertQueriesInterface,
	MigrationServiceInterface,
	SelectQueriesInterface,
	TableAltererInterface,
	TableBuilderInterface,
	UpdateQueriesInterface,
	ViewQueriesInterface
} from '@strategies/postgres/interfaces';
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

export class DataSourcePostgres extends BaseQueries implements DataSourceInterface {
	client: PoolClient;
	private _tableBuilder: TableBuilderInterface;
	private _tableAlterer: TableAltererInterface;
	private _migrationService: MigrationServiceInterface;
	private _selectQueries: SelectQueriesInterface;
	private _insertQueries: InsertQueriesInterface;
	private _updateQueries: UpdateQueriesInterface;
	private _deleteQueries: DeleteQueriesInterface;
	private _viewQueries: ViewQueriesInterface;

	constructor() {
		super();
		this._migrationService = new MigrationService();
		this._tableBuilder = new TableBuilder();
		this._tableAlterer = new TableAlterer();
		this._selectQueries = new SelectQueries();
		this._insertQueries = new InsertQueries();
		this._updateQueries = new UpdateQueries();
		this._deleteQueries = new DeleteQueries();
		this._viewQueries = new ViewQueries();
	}

	async connect(dataToConnect: ConnectionData): Promise<void> {
		const pool = new Pool(dataToConnect);
		this.client = await pool.connect();
	}

	createTable(options: CreateTableOptionsInterface): string {
		return this._tableBuilder.createTable(
			options?.table,
			options?.columns,
			options?.computedColumns,
			options?.foreignKeys,
			options?.primaryColumn,
			options?.oneToOne,
			options?.oneToMany,
			options?.manyToMany
		);
	}

	createMigrationTable(tableName: string, tableSchema: string): string {
		return this._migrationService.createMigrationTable(tableName, tableSchema);
	}

	checkTableExistence(dataSource: DataSourceInterface, tableName: string, tableSchema?: string): Promise<boolean> {
		return this._migrationService.checkTableExistence(dataSource, tableName, tableSchema);
	}

	initCurrentDatabaseIngot(
		dataSource: DataSourceInterface,
		tableName: string,
		tableSchema: string,
		databaseIngot: DatabaseIngotInterface
	): Promise<void> {
		return this._migrationService.initCurrentDatabaseIngot(dataSource, tableName, tableSchema, databaseIngot);
	}

	syncDatabaseIngot(
		dataSource: DataSourceInterface,
		tableName: string,
		tableSchema: string,
		databaseIngot: DatabaseIngotInterface
	): Promise<void> {
		return this._migrationService.syncDatabaseIngot(dataSource, tableName, tableSchema, databaseIngot);
	}

	getCurrentDatabaseIngot(
		dataSource: DataSourceInterface,
		tableName: string,
		tableSchema: string
	): Promise<DatabaseIngotInterface> {
		return this._migrationService.getCurrentDatabaseIngot(dataSource, tableName, tableSchema);
	}

	//Base table manipulation queries
	addColumn(tableName: string, parameters: AddColumnInterface): string {
		return this._tableAlterer.addColumn(tableName, parameters);
	}

	deleteColumn(tableName: string, parameters: DeleteColumnInterface<DataSourcePostgres>): string {
		return this._tableAlterer.deleteColumn(tableName, parameters);
	}

	addNotNullToColumn(tableName: string, parameters: AddNotNullToColumnInterface<DataSourcePostgres>): string {
		return this._tableAlterer.addNotNullToColumn(tableName, parameters);
	}

	dropNotNullFromColumn(tableName: string, parameters: DropNotNullFromColumnInterface<DataSourcePostgres>): string {
		return this._tableAlterer.dropNotNullFromColumn(tableName, parameters);
	}

	addUniqueToColumn(tableName: string, parameters: AddUniqueToColumnInterface<DataSourcePostgres>): string {
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

	addPrimaryGeneratedColumn(tableName: string, parameters: AddPrimaryGeneratedColumnInterface): string {
		return this._tableAlterer.addPrimaryGeneratedColumn(tableName, parameters);
	}

	addForeignKey(tableName: string, parameters: AddForeignKeyInterface): string {
		return this._tableAlterer.addForeignKey(tableName, parameters);
	}

	//Get current time
	getCurrentTimestamp(): string {
		return 'SELECT current_timestamp;';
	}

	//Select queries
	where(params: {
		conditions?: Condition;
		logicalOperator?: LogicalOperators;
		exists?: string
	} | string): string {
		return this._selectQueries.where(params);
	}

	//Insert queries
	insert(values: Partial<unknown>, tableName: string): string {
		return this._insertQueries.insert(values, tableName);
	}

	insertMany(values: Partial<unknown>[], tableName: string): string {
		return this._insertQueries.insertMany(values, tableName);
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
}