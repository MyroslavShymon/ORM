import { DataSourcePostgres } from '@strategies/postgres';
import { TableOptionsMysqlInterface, TableOptionsPostgresqlInterface } from '@decorators/index';

export interface TableInterface<DB> {
	name: string;
	options?: DB extends DataSourcePostgres ? TableOptionsPostgresqlInterface : TableOptionsMysqlInterface;
}