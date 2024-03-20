import { Connection, createConnection } from 'mysql2/promise';
import {
	AddColumnInterface,
	AddNotNullToColumnInterface,
	AddUniqueToColumnInterface,
	ChangeColumnDatatypeInterface,
	ColumnInterface,
	ComputedColumnInterface,
	DatabaseIngotInterface,
	DataSourceInterface,
	DeleteColumnInterface,
	DropNotNullFromColumnInterface,
	TableInterface
} from '@core/interfaces';
import { ConnectionData } from '@core/types';
import {
	DeleteQueriesInterface,
	InsertQueriesInterface,
	MigrationServiceInterface,
	SelectQueriesInterface,
	TableAltererInterface,
	TableBuilderInterface,
	UpdateQueriesInterface,
	ViewQueriesInterface
} from '@strategies/mysql/interfaces';
import {
	DeleteQueries,
	InsertQueries,
	MigrationService,
	SelectQueries,
	TableAlterer,
	TableBuilder,
	UpdateQueries,
	ViewQueries
} from '@strategies/mysql/components';
import { BaseQueries } from '@strategies/base-queries';
import { Condition, LogicalOperators } from '@context/common';

export class DataSourceMySql extends BaseQueries implements DataSourceInterface {
	client: Connection;
	private _tableBuilder: TableBuilderInterface;
	private _tableAlterer: TableAltererInterface;
	private _migrationService: MigrationServiceInterface;
	private _insertQueries: InsertQueriesInterface;
	private _updateQueries: UpdateQueriesInterface;
	private _deleteQueries: DeleteQueriesInterface;
	private _viewQueries: ViewQueriesInterface;
	private _selectQueries: SelectQueriesInterface;

	constructor() {
		super();
		this._tableBuilder = new TableBuilder();
		this._tableAlterer = new TableAlterer();
		this._migrationService = new MigrationService();
		this._insertQueries = new InsertQueries();
		this._updateQueries = new UpdateQueries();
		this._deleteQueries = new DeleteQueries();
		this._viewQueries = new ViewQueries();
		this._selectQueries = new SelectQueries();
	}

	async connect(dataToConnect: ConnectionData): Promise<void> {
		this.client = await createConnection(dataToConnect);
	}

	createTable(
		table?: TableInterface<DataSourceMySql>,
		columns?: ColumnInterface<DataSourceMySql>[],
		computedColumns?: ComputedColumnInterface<DataSourceMySql>[]
	): string {
		return this._tableBuilder.createTable(table, columns, computedColumns);
	}

	checkTableExistence(dataSource: DataSourceInterface, tableName: string, tableSchema?: string): Promise<boolean> {
		return this._migrationService.checkTableExistence(dataSource, tableName, tableSchema);
	}

	createMigrationTable(tableName: string, tableSchema: string): string {
		return this._migrationService.createMigrationTable(tableName, tableSchema);
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

	//table manipulation
	addColumn(tableName: string, parameters: AddColumnInterface<DataSourceMySql>): string {
		return this._tableAlterer.addColumn(tableName, parameters);
	}

	deleteColumn(tableName: string, parameters: DeleteColumnInterface<DataSourceMySql>): string {
		return this._tableAlterer.deleteColumn(tableName, parameters);
	}

	addNotNullToColumn(tableName: string, parameters: AddNotNullToColumnInterface<DataSourceMySql>): string {
		return this._tableAlterer.addNotNullToColumn(tableName, parameters);
	}

	dropNotNullFromColumn(tableName: string, parameters: DropNotNullFromColumnInterface<DataSourceMySql>): string {
		return this._tableAlterer.dropNotNullFromColumn(tableName, parameters);
	}

	addUniqueToColumn(tableName: string, parameters: AddUniqueToColumnInterface<DataSourceMySql>): string {
		return this._tableAlterer.addUniqueToColumn(tableName, parameters);
	}

	changeDataTypeOfColumn(tableName: string, parameters: ChangeColumnDatatypeInterface): string {
		return this._tableAlterer.changeDataTypeOfColumn(tableName, parameters);
	}

	//get time
	getCurrentTimestamp(): string {
		return 'SELECT NOW();';
	}

	//TODO query
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