import { DatabasesTypes } from '@core/enums';
import { TableOptionsMysqlInterface, TableOptionsPostgresqlInterface } from '@core/interfaces';

export type TableOptionsInterface<DT extends DatabasesTypes | undefined = undefined> =
	DT extends DatabasesTypes.POSTGRES ? TableOptionsPostgresqlInterface :
		DT extends DatabasesTypes.MYSQL ? TableOptionsMysqlInterface :
			never;