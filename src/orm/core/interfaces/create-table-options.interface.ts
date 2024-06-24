import { DatabasesTypes } from '@core/enums';
import { CreateTableOptionsPostgresInterface } from '@core/interfaces/create-table-options-postgres.interface';
import { CreateTableOptionsMysqlInterface } from '@core/interfaces/create-table-options-mysql.interface';

export type CreateTableOptionsInterface<DT extends DatabasesTypes | undefined = undefined> =
	DT extends DatabasesTypes.POSTGRES ? CreateTableOptionsPostgresInterface :
		DT extends DatabasesTypes.MYSQL ? CreateTableOptionsMysqlInterface :
			never;