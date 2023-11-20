import { DataSourcePostgres } from '../../strategies/postgres';
import { ColumnOptionsInterfaceMysql, ColumnOptionsInterfacePostgres } from '../../decorators';

export interface AddColumnInterface<DB> {
	columnName: string;
	options?: DB extends DataSourcePostgres ? ColumnOptionsInterfacePostgres : ColumnOptionsInterfaceMysql;
}