import { Connection, createConnection } from 'mysql2/promise';
import {
	AddColumnInterface,
	ColumnInterface,
	ComputedColumnInterface,
	DataSourceInterface,
	TableInterface
} from '@core/interfaces';
import { ConnectionData } from '@core/types';
import { MigrationServiceInterface, TableAltererInterface, TableBuilderInterface } from '@strategies/mysql/interfaces';
import { MigrationService, TableAlterer, TableBuilder } from '@strategies/mysql/components';

export class DataSourceMySql implements DataSourceInterface {
	client: Connection;
	tableBuilder: TableBuilderInterface;
	tableAlterer: TableAltererInterface;
	migrationService: MigrationServiceInterface;

	constructor() {
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

	addColumn(tableName: string, parameters: AddColumnInterface<DataSourceMySql>): string {
		return this.tableAlterer.addColumn(tableName, parameters);
	}

	checkTableExistence(dataSource: DataSourceInterface, tableName: string, tableSchema?: string): Promise<boolean> {
		return this.migrationService.checkTableExistence(dataSource, tableName, tableSchema);
	}

	createMigrationTable(): string {
		return this.migrationService.createMigrationTable();
	}

	getCurrentTimestamp(): string {
		return 'SELECT NOW();';
	}
}