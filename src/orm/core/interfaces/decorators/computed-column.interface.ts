import { DataSourcePostgres } from '@strategies/postgres';
import { MysqlDataTypes, PostgresqlDataTypes } from '@core/enums';

export interface ComputedColumnInterface<DB> {
	name: string;
	dataType: DB extends DataSourcePostgres ? PostgresqlDataTypes : MysqlDataTypes;
	calculate: string;
	stored: boolean;
}