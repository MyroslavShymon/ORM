import { Pool, PoolClient } from 'pg';
import {
	AddColumnInterface,
	AddDefaultValueInterface,
	AddNotNullToColumnInterface,
	AddUniqueToColumnInterface,
	ChangeColumnDatatypeInterface,
	ColumnInterface,
	ComputedColumnInterface,
	DatabaseIngotInterface,
	DataSourceInterface,
	DeleteColumnInterface,
	DropDefaultValueInterface,
	DropNotNullFromColumnInterface,
	DropTableInterface,
	RenameColumnInterface,
	RenameTableInterface,
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
import { ForeignKeyInterface, PrimaryGeneratedColumnInterface } from '@decorators/postgres';
import { BaseQueries } from '@strategies/base-queries';
import { Condition, LogicalOperators } from '@context/common';

export class DataSourcePostgres extends BaseQueries implements DataSourceInterface {
	client: PoolClient;
	tableBuilder: TableBuilderInterface;
	tableAlterer: TableAltererInterface;
	migrationService: MigrationServiceInterface;
	selectQueries: SelectQueriesInterface;
	insertQueries: InsertQueriesInterface;
	updateQueries: UpdateQueriesInterface;
	deleteQueries: DeleteQueriesInterface;
	viewQueries: ViewQueriesInterface;

	constructor() {
		super();
		this.migrationService = new MigrationService();
		this.tableBuilder = new TableBuilder();
		this.tableAlterer = new TableAlterer();
		this.selectQueries = new SelectQueries();
		this.insertQueries = new InsertQueries();
		this.updateQueries = new UpdateQueries();
		this.deleteQueries = new DeleteQueries();
		this.viewQueries = new ViewQueries();
	}

	async connect(dataToConnect: ConnectionData): Promise<void> {
		const pool = new Pool(dataToConnect);
		this.client = await pool.connect();
	}

	createTable(
		table?: TableInterface<DataSourcePostgres>,
		columns?: ColumnInterface<DataSourcePostgres>[],
		computedColumns?: ComputedColumnInterface<DataSourcePostgres>[],
		foreignKeys?: ForeignKeyInterface[],
		primaryColumn?: PrimaryGeneratedColumnInterface
	): string {
		return this.tableBuilder.createTable(table, columns, computedColumns, foreignKeys, primaryColumn);
	}

	createMigrationTable(tableName: string, tableSchema: string): string {
		return this.migrationService.createMigrationTable(tableName, tableSchema);
	}

	checkTableExistence(dataSource: DataSourceInterface, tableName: string, tableSchema?: string): Promise<boolean> {
		return this.migrationService.checkTableExistence(dataSource, tableName, tableSchema);
	}

	initCurrentDatabaseIngot(
		dataSource: DataSourceInterface,
		tableName: string,
		tableSchema: string,
		databaseIngot: DatabaseIngotInterface
	): Promise<void> {
		return this.migrationService.initCurrentDatabaseIngot(dataSource, tableName, tableSchema, databaseIngot);
	}

	syncDatabaseIngot(
		dataSource: DataSourceInterface,
		tableName: string,
		tableSchema: string,
		databaseIngot: DatabaseIngotInterface
	): Promise<void> {
		return this.migrationService.syncDatabaseIngot(dataSource, tableName, tableSchema, databaseIngot);
	}

	addColumn(tableName: string, parameters: AddColumnInterface<DataSourcePostgres>): string {
		return this.tableAlterer.addColumn(tableName, parameters);
	}

	addDefaultValue(tableName: string, parameters: AddDefaultValueInterface): string {
		return this.tableAlterer.addDefaultValue(tableName, parameters);
	}

	dropDefaultValue(tableName: string, parameters: DropDefaultValueInterface): string {
		return this.tableAlterer.dropDefaultValue(tableName, parameters);
	}

	changeDataTypeOfColumn(tableName: string, parameters: ChangeColumnDatatypeInterface): string {
		return this.tableAlterer.changeDataTypeOfColumn(tableName, parameters);
	}

	renameColumn(tableName: string, parameters: RenameColumnInterface): string {
		return this.tableAlterer.renameColumn(tableName, parameters);
	}

	renameTable(tableName: string, parameters: RenameTableInterface): string {
		return this.tableAlterer.renameTable(tableName, parameters);
	}

	addNotNullToColumn(tableName: string, parameters: AddNotNullToColumnInterface): string {
		return this.tableAlterer.addNotNullToColumn(tableName, parameters);
	}

	dropNotNullFromColumn(tableName: string, parameters: DropNotNullFromColumnInterface): string {
		return this.tableAlterer.dropNotNullFromColumn(tableName, parameters);
	}

	addUniqueToColumn(tableName: string, parameters: AddUniqueToColumnInterface): string {
		return this.tableAlterer.addUniqueToColumn(tableName, parameters);
	}

	deleteColumn(tableName: string, parameters: DeleteColumnInterface): string {
		return this.tableAlterer.deleteColumn(tableName, parameters);
	}

	dropTable(tableName: string, parameters: DropTableInterface): string {
		return this.tableAlterer.dropTable(tableName, parameters);
	}

	getCurrentTimestamp(): string {
		return 'SELECT current_timestamp;';
	}

	//Select queries
	where(params: {
		conditions?: Condition;
		logicalOperator?: LogicalOperators;
		exists?: string
	} | string): string {
		return this.selectQueries.where(params);
	}

	//Insert queries
	insert(values: Partial<unknown>, tableName: string): string {
		return this.insertQueries.insert(values, tableName);
	}

	insertMany(values: Partial<unknown>[], tableName: string): string {
		return this.insertQueries.insertMany(values, tableName);
	}

	//Update queries
	update(values: Partial<Object>, tableName: string): string {
		return this.updateQueries.update(values, tableName);
	}

	//Delete queries
	deleting(tableName: string): string {
		return this.deleteQueries.deleting(tableName);
	}

	//Base queries
	createView(name: string): string {
		return this.viewQueries.createView(name);
	}
}