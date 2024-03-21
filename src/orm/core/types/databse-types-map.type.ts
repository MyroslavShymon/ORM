import { DatabasesTypes, MysqlDataTypes, PostgresqlDataTypes } from '@core/enums';

export type DatabaseTypesMap<T extends string> = T extends DatabasesTypes.POSTGRES ? PostgresqlDataTypes :
	T extends DatabasesTypes.MYSQL ? MysqlDataTypes :
		T extends DatabasesTypes.SQL_SERVER ? any :
			/* інші варіанти */ any;

// const databaseType = DatabasesTypes.POSTGRES
// type MyDatabaseType = DatabaseTypesMap<DatabasesTypes>;
// const aaaa: MyDatabaseType = PostgresqlDataTypes.VARCHAR