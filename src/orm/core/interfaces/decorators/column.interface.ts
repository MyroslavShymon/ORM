import { ColumnOptionsInterfaceMysql, ColumnOptionsInterfacePostgres } from '../../../decorators';
import { DataSourcePostgres } from '../../../strategies/postgres';

export interface ColumnInterface<DB> {
	name: string;
	options?: DB extends DataSourcePostgres ? ColumnOptionsInterfacePostgres : ColumnOptionsInterfaceMysql;
}