import { DataSourcePostgres } from '@strategies/postgres';
import { ColumnOptionsInterfacePostgres } from '@decorators/postgres';
import { ColumnOptionsInterfaceMysql } from '@decorators/mysql';

export interface AddColumnInterface<DB> {
	columnName: string;
	options?: DB extends DataSourcePostgres ? ColumnOptionsInterfacePostgres : ColumnOptionsInterfaceMysql;
}