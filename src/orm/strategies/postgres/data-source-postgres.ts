import { Pool, PoolClient } from 'pg';
import {
	AddColumnInterface,
	ColumnInterface,
	ComputedColumnInterface,
	DataSourceInterface,
	TableInterface
} from '@core/interfaces';
import { ConnectionData } from '@core/types';
import { TableAltererInterface, TableBuilderInterface } from '@strategies/postgres/interfaces';
import { TableAlterer, TableBuilder } from '@strategies/postgres/components';

export class DataSourcePostgres implements DataSourceInterface {
	client: PoolClient;
	tableBuilder: TableBuilderInterface;
	tableAlterer: TableAltererInterface;

	constructor() {
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

	addColumn(tableName: string, parameters: AddColumnInterface<DataSourcePostgres>): string {
		return this.tableAlterer.addColumn(tableName, parameters);
	}

	getCurrentTimestamp(): string {
		return 'SELECT current_timestamp;';
	}
}