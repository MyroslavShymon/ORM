import { DataSourcePostgres } from '@strategies/postgres';
import { MysqlDataTypes, PostgresqlDataTypes } from '@core/types';
import { ColumnInterface } from '@core/interfaces';

export interface ComputedColumnInterface<DB> extends ColumnInterface {
	id?: string;
	name: string;
	dataType: DB extends DataSourcePostgres ? PostgresqlDataTypes : MysqlDataTypes;
	calculate: string;
	stored: boolean;
}