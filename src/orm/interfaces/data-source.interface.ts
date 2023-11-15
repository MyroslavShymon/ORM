import { ConnectionData } from '../types';
import { ColumnInterface, TableInterface } from './decorators';
import { ComputedColumnInterface } from './decorators/computed-column';
import { AddColumnInterface } from './table-manipulations';
import { TableAltererInterface, TableBuilderInterface } from '../strategy/strategies/postgres';

export interface DataSourceInterface {
	client;
	tableBuilder: TableBuilderInterface;
	tableAlterer: TableAltererInterface;

	connect(dataToConnect: ConnectionData);

	createTable(table?: TableInterface, columns?: ColumnInterface[], computedColumns?: ComputedColumnInterface[]): string;

	addColumn(tableName: string, parameters: AddColumnInterface): string;

	getCurrentTimestamp(): string;
}
