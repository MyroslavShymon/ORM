import { DataSourcePostgres } from '@strategies/postgres';
import { ColumnInterface, ComputedColumnInterface, TableInterface } from '@core/interfaces';
import { ForeignKeyInterface, PrimaryGeneratedColumnInterface } from '@decorators/postgres';

export interface TableBuilderInterface {
	createTable(
		table?: TableInterface<DataSourcePostgres>,
		columns?: ColumnInterface<DataSourcePostgres>[],
		computedColumns?: ComputedColumnInterface<DataSourcePostgres>[],
		foreignKeys?: ForeignKeyInterface[],
		primaryColumn?: PrimaryGeneratedColumnInterface
	): string;
}