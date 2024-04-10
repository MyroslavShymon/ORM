import { DatabasesTypes } from '@core/enums';
import { MysqlDataTypes, PostgresqlDataTypes } from '@core/types';

export interface BaseComputedColumnInterface<DT extends DatabasesTypes | undefined = undefined> {
	dataType: PostgresqlDataTypes | MysqlDataTypes;
	calculate: string;
	stored: boolean;
}