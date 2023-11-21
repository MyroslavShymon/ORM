import { ConnectionData } from '@core/types';
import { ColumnInterface, ComputedColumnInterface, TableInterface } from '@core/interfaces/decorators';
import { AddColumnInterface } from '@core/interfaces/add-column.interface';
import {
	TableAltererInterface as TableAltererInterfacePostgres,
	TableBuilderInterface as TableBuilderInterfacePostgres
} from '../../strategies/postgres';
import {
	TableAltererInterface as TableAltererInterfaceMysql,
	TableBuilderInterface as TableBuilderInterfaceMysql
} from '../../strategies/mysql';

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
