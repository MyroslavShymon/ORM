import { Connection, createConnection } from 'mysql2/promise';
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
	RenameColumnInterface,
	RenameTableInterface,
	TableInterface
} from '@core/interfaces';
import { ConnectionData } from '@core/types';
import { MigrationServiceInterface, TableAltererInterface, TableBuilderInterface } from '@strategies/mysql/interfaces';
import { MigrationService, TableAlterer, TableBuilder } from '@strategies/mysql/components';
import { BaseQueries } from '@strategies/base-queries';
import { Condition, LogicalOperators } from '@context/types';

export class DataSourceMySql extends BaseQueries implements DataSourceInterface {
	client: Connection;
	tableBuilder: TableBuilderInterface;
	tableAlterer: TableAltererInterface;
	migrationService: MigrationServiceInterface;

	constructor() {
		super();
		this.tableBuilder = new TableBuilder();
		this.tableAlterer = new TableAlterer();
		this.migrationService = new MigrationService();
	}

	async connect(dataToConnect: ConnectionData): Promise<void> {
		this.client = await createConnection(dataToConnect);
	}

	createTable(
		table?: TableInterface<DataSourceMySql>,
		columns?: ColumnInterface<DataSourceMySql>[],
		computedColumns?: ComputedColumnInterface<DataSourceMySql>[]
	): string {
		return this.tableBuilder.createTable(table, columns, computedColumns);
	}

	checkTableExistence(dataSource: DataSourceInterface, tableName: string, tableSchema?: string): Promise<boolean> {
		return this.migrationService.checkTableExistence(dataSource, tableName, tableSchema);
	}

	createMigrationTable(tableName: string, tableSchema: string): string {
		return this.migrationService.createMigrationTable(tableName, tableSchema);
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

	addColumn(tableName: string, parameters: AddColumnInterface<DataSourceMySql>): string {
		return this.tableAlterer.addColumn(tableName, parameters);
	}

	deleteColumn(tableName: string, parameters: DeleteColumnInterface): string {
		return this.tableAlterer.deleteColumn(tableName, parameters);
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
		return '';
	}

	//Insert queries
	insert(values: Partial<unknown>, tableName: string): string {
		return '';
	}

	insertMany(values: Partial<unknown>[], tableName: string): string {
		return '';
	}

	//Update queries
	update(values: Partial<Object>, tableName: string): string {
		return '';
	}

	//Delete queries
	deleting(tableName: string): string {
		return '';
	}

	//Base queries
	createView(name: string): string {
		return '';
	}
}