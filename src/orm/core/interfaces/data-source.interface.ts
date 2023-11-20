import { ColumnInterface, ComputedColumnInterface, TableInterface } from './decorators';
import { AddColumnInterface } from './add-column.interface';
import { ConnectionData } from '../types';
import {
	TableAltererInterface as TableAltererInterfaceMysql,
	TableBuilderInterface as TableBuilderInterfaceMysql
} from '../../strategies/mysql';
import {
	TableAltererInterface as TableAltererInterfacePostgres,
	TableBuilderInterface as TableBuilderInterfacePostgres
} from '../../strategies/postgres';

export interface DataSourceInterface {
	client;
	tableBuilder: TableBuilderInterfacePostgres | TableBuilderInterfaceMysql;
	tableAlterer: TableAltererInterfacePostgres | TableAltererInterfaceMysql;

	connect(dataToConnect: ConnectionData);

	createTable(
		table?: TableInterface<DataSourceInterface>,
		columns?: ColumnInterface<DataSourceInterface>[],
		computedColumns?: ComputedColumnInterface<DataSourceInterface>[]
	): string;

	addColumn(tableName: string, parameters: AddColumnInterface<DataSourceInterface>): string;

	getCurrentTimestamp(): string;
}
