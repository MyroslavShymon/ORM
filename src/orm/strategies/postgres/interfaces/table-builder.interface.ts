import { DataSourcePostgres } from '@strategies/postgres';
import {
	ColumnInterface,
	ComputedColumnInterface,
	ForeignKeyInterface,
	PrimaryGeneratedColumnInterface,
	TableInterface
} from '@core/interfaces';

export interface TableBuilderInterface {
	createTable(
		table?: TableInterface<DataSourcePostgres>,
		columns?: ColumnInterface[],
		computedColumns?: ComputedColumnInterface[],
		foreignKeys?: ForeignKeyInterface[],
		primaryColumn?: PrimaryGeneratedColumnInterface
	): string;
}