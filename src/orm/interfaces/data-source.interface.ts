import { ConnectionData } from '../types';
import { ColumnInterface, TableInterface } from './decorators';
import { ComputedColumnInterface } from './decorators/computed-column';

export interface DataSourceInterface {
	client;

	connect(dataToConnect: ConnectionData);

	createTable(table?: TableInterface, columns?: ColumnInterface[], computedColumns?: ComputedColumnInterface[]): string;

	getCurrentTimestamp(): string;
}
