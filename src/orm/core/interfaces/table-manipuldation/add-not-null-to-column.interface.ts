import { DatabasesTypes } from '@core/enums';
import { AddNotNullToColumnMysqlInterface, AddNotNullToColumnPostgresInterface } from '@core/interfaces';

export type AddNotNullToColumnInterface<DT extends DatabasesTypes | undefined = undefined> =
	DT extends DatabasesTypes.POSTGRES ? AddNotNullToColumnPostgresInterface :
		DT extends DatabasesTypes.MYSQL ? AddNotNullToColumnMysqlInterface :
			never;