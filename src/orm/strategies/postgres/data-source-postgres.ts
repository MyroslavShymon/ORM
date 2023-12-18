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
	RenameColumnInterface,
	RenameTableInterface,
	TableInterface
} from '@core/interfaces';
import { ConnectionData } from '@core/types';
import {
	MigrationServiceInterface,
	TableAltererInterface,
	TableBuilderInterface
} from '@strategies/postgres/interfaces';
import { MigrationService, TableAlterer, TableBuilder } from '@strategies/postgres/components';

export class DataSourcePostgres implements DataSourceInterface {
	client: PoolClient;
	tableBuilder: TableBuilderInterface;
	tableAlterer: TableAltererInterface;
	migrationService: MigrationServiceInterface;

	constructor() {
		this.migrationService = new MigrationService();
		this.tableBuilder = new TableBuilder();
		this.tableAlterer = new TableAlterer();
	}

	async connect(dataToConnect: ConnectionData): Promise<void> {
		const pool = new Pool(dataToConnect);
		this.client = await pool.connect();
	}

	createTable(
		table?: TableInterface<DataSourcePostgres>,
		columns?: ColumnInterface<DataSourcePostgres>[],
		computedColumns?: ComputedColumnInterface<DataSourcePostgres>[]
	): string {
		return this.tableBuilder.createTable(table, columns, computedColumns);
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

	getCurrentTimestamp(): string {
		return 'SELECT current_timestamp;';
	}
}