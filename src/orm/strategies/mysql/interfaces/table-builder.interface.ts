import { ColumnInterface, ComputedColumnInterface, TableInterface } from '@core/interfaces';
import { DataSourceMySql } from '@strategies/mysql';

export interface TableBuilderInterface {
	createTable(
		table?: TableInterface<DataSourceMySql>,
		columns?: ColumnInterface<DataSourceMySql>[],
		computedColumns?: ComputedColumnInterface<DataSourceMySql>[]
	): string;
}