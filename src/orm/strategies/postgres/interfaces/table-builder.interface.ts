import { DataSourcePostgres } from '@strategies/postgres';
import { ColumnInterface, ComputedColumnInterface, TableInterface } from '@core/interfaces';

export interface TableBuilderInterface {
	createTable(
		table?: TableInterface<DataSourcePostgres>,
		columns?: ColumnInterface<DataSourcePostgres>[],
		computedColumns?: ComputedColumnInterface<DataSourcePostgres>[]
	): string;
}