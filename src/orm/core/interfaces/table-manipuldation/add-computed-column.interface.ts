import { MysqlDataTypes, PostgresqlDataTypes } from '@core/types';

export interface AddComputedColumnInterface {
	dataType: PostgresqlDataTypes | MysqlDataTypes;
	calculate: string;
}