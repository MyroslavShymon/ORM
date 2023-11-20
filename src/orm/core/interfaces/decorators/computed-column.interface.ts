import { MysqlDataTypes, PostgresqlDataTypes } from '../../enums';
import { DataSourcePostgres } from '../../../strategies/postgres';

export interface ComputedColumnInterface<DB> {
	name: string;
	dataType: DB extends DataSourcePostgres ? PostgresqlDataTypes : MysqlDataTypes;
	calculate: string;
	stored: boolean;
}