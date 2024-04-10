import { DataSourcePostgres } from '@strategies/postgres';
import { ColumnInterface, ComputedColumnInterface, TableInterface } from '@core/interfaces';
import { ForeignKeyInterface, PrimaryGeneratedColumnInterface } from '@decorators/index';

export interface TableBuilderInterface {
	createTable(
		table?: TableInterface<DataSourcePostgres>,
		columns?: ColumnInterface[],
		computedColumns?: ComputedColumnInterface[],
		foreignKeys?: ForeignKeyInterface[],
		primaryColumn?: PrimaryGeneratedColumnInterface
	): string;
}