import { DataSourcePostgres } from '@strategies/postgres';
import { ColumnOptionsInterfacePostgres } from '@decorators/postgres';
import { ColumnOptionsInterfaceMysql } from '@decorators/mysql';

export interface ColumnInterface<DB> {
	id?: string;
	name: string;
	options?: DB extends DataSourcePostgres ? ColumnOptionsInterfacePostgres : ColumnOptionsInterfaceMysql;
}