import { DatabasesTypes } from '@core/enums';
import { DropIndexMysqlInterface, DropIndexPostgresInterface } from '@core/interfaces';

export type DropIndexInterface<DT extends DatabasesTypes | undefined = undefined> =
	DT extends DatabasesTypes.POSTGRES ? DropIndexPostgresInterface :
		DT extends DatabasesTypes.MYSQL ? DropIndexMysqlInterface :
			never;
