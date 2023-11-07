import { ConnectionData } from '../types';
import { ColumnInterface, TableInterface } from './decorators';

export interface DataSourceInterface {
	client;

	connect(dataToConnect: ConnectionData);

	createTable(table: TableInterface, columns: ColumnInterface[]): string;
}
