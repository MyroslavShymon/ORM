import { DatabasesTypes } from '@core/enums';
import { DropTableMysqlInterface, DropTablePostgresInterface } from '@core/interfaces';

export type DropTableInterface<DT extends DatabasesTypes> =
	DT extends DatabasesTypes.POSTGRES ? DropTablePostgresInterface :
		DT extends DatabasesTypes.MYSQL ? DropTableMysqlInterface :
			never;