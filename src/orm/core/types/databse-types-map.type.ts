// export type DatabaseTypesMap<T extends string | any> = T extends DatabasesTypes.POSTGRES ? PostgresqlDataTypes :
// 	T extends DatabasesTypes.MYSQL ? MysqlDataTypes :
// 		T extends DatabasesTypes.SQL_SERVER ? any :
// 			/* інші варіанти */ any;