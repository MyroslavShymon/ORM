import { Connection, createConnection } from 'mysql2/promise';
import {
	AddColumnInterface,
	ColumnInterface,
	ComputedColumnInterface,
	ConnectionData,
	DataSourceInterface,
	TableInterface
} from '../../core';
import { TableAltererInterface, TableBuilderInterface } from './interfaces';
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

	getCurrentTimestamp(): string {
		return 'SELECT NOW();';
	}
}