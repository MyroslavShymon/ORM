import { Pool, PoolClient } from 'pg';
import { AddColumnInterface, ColumnInterface, DataSourceInterface, TableInterface } from '../../../interfaces';
import { ConnectionData } from '../../../types';
import { TableAltererInterface, TableBuilderInterface } from './interfaces';
import { TableAlterer, TableBuilder } from './components';
import { ComputedColumnInterface } from '../../../interfaces/decorators/computed-column';

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

	createTable(table?: TableInterface, columns?: ColumnInterface[], computedColumns?: ComputedColumnInterface[]): string {
		return this.tableBuilder.createTable(table, columns, computedColumns);
	}

	addColumn(tableName: string, parameters: AddColumnInterface): string {
		return this.tableAlterer.addColumn(tableName, parameters);
	}

	getCurrentTimestamp(): string {
		return 'SELECT current_timestamp;';
	}
}