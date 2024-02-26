import { DataSourcePostgres } from '@strategies/postgres';
import { MysqlDataTypes, PostgresqlDataTypes } from '@core/enums';
import { ColumnInterface } from '@core/interfaces';

export interface ComputedColumnInterface<DB> extends ColumnInterface<DB> {
	id?: string;
	name: string;
	dataType: DB extends DataSourcePostgres ? PostgresqlDataTypes : MysqlDataTypes;
	calculate: string;
	stored: boolean;
}