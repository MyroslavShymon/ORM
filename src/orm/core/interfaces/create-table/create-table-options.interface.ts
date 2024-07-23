import { DatabasesTypes } from '@core/enums';
import { CreateTableOptionsMysqlInterface, CreateTableOptionsPostgresInterface } from '@core/interfaces';

export type CreateTableOptionsInterface<DT extends DatabasesTypes> =
	DT extends DatabasesTypes.POSTGRES ? CreateTableOptionsPostgresInterface :
		DT extends DatabasesTypes.MYSQL ? CreateTableOptionsMysqlInterface :
			never;