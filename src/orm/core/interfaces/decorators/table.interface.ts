import { TableOptionsPostgresqlInterface as TableOptionsInterfacePostgres } from '../../../decorators/postgres';
import { TableOptionsMysqlInterface as TableOptionsInterfaceMysql } from '../../../decorators/mysql';
import { DataSourcePostgres } from '../../../strategies/postgres';

export interface TableInterface<DB> {
	name: string;
	options?: DB extends DataSourcePostgres ? TableOptionsInterfacePostgres : TableOptionsInterfaceMysql;
}