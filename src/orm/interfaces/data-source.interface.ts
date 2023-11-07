import { ConnectionData } from '../types/connection-data';
import { ColumnInterface } from './decorators/column/column.interface';
import { TableInterface } from './decorators/table/table.interface';

export interface DataSourceInterface {
	client;

	connect(dataToConnect: ConnectionData);

	createTable(table: TableInterface, columns: ColumnInterface[]): string;
}
