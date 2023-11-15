import { Connection, createConnection } from 'mysql2/promise';
import { AddColumnInterface, ColumnInterface, DataSourceInterface, TableInterface } from '../../../interfaces';
import { ConnectionData } from '../../../types';
import { TableAltererInterface, TableBuilderInterface } from './interfaces';
import { ComputedColumnInterface } from '../../../interfaces/decorators/computed-column';
import { TableAlterer, TableBuilder } from './components';

export class DataSourceMySql implements DataSourceInterface {
	client: Connection;
	tableBuilder: TableBuilderInterface;
	tableAlterer: TableAltererInterface;

	constructor() {
		this.tableBuilder = new TableBuilder();
		this.tableAlterer = new TableAlterer();
	}

	async connect(dataToConnect: ConnectionData): Promise<void> {
		this.client = await createConnection(dataToConnect);
	}

	createTable(table?: TableInterface, columns?: ColumnInterface[], computedColumns?: ComputedColumnInterface[]): string {
		return this.tableBuilder.createTable(table, columns, computedColumns);
	}

	addColumn(tableName: string, parameters: AddColumnInterface): string {
		return this.tableAlterer.addColumn(tableName, parameters);
	}

	getCurrentTimestamp(): string {
		return 'SELECT NOW();';
	}
}