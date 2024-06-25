import { DatabasesTypes } from '@core/enums';
import { MysqlDataTypes, PostgresqlDataTypes } from '@core/types';

export interface BaseComputedColumnInterface<DT extends DatabasesTypes | undefined = undefined> {
	dataType: DT extends DatabasesTypes.POSTGRES ? PostgresqlDataTypes :
		DT extends DatabasesTypes.MYSQL ? MysqlDataTypes :
			never;
	calculate: string;
}