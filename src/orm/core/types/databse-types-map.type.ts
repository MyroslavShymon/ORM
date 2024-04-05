import { DatabasesTypes } from '@core/enums';
import { PostgresqlDataTypes } from '@core/types/postgresql-data-types';
import { MysqlDataTypes } from '@core/types/mysql-data-types';

export type DatabaseTypesMap<T extends string | any> = T extends DatabasesTypes.POSTGRES ? PostgresqlDataTypes :
	T extends DatabasesTypes.MYSQL ? MysqlDataTypes :
		T extends DatabasesTypes.SQL_SERVER ? any :
			/* інші варіанти */ any;