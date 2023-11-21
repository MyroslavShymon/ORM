import { DataSourcePostgres } from '@strategies/postgres';
import { TableOptionsPostgresqlInterface } from '@decorators/postgres';
import { TableOptionsMysqlInterface } from '@decorators/mysql';

export interface TableInterface<DB> {
	name: string;
	options?: DB extends DataSourcePostgres ? TableOptionsPostgresqlInterface : TableOptionsMysqlInterface;
}