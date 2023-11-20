import { ColumnInterface, ComputedColumnInterface, TableInterface } from '../../../core';
import { DataSourcePostgres } from '../data-source-postgres';

export interface TableBuilderInterface {
	createTable(
		table?: TableInterface<DataSourcePostgres>,
		columns?: ColumnInterface<DataSourcePostgres>[],
		computedColumns?: ComputedColumnInterface<DataSourcePostgres>[]
	): string;
}