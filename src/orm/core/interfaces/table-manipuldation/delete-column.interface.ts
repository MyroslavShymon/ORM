import { DatabasesTypes } from '@core/enums';
import { DeleteColumnMysqlInterface, DeleteColumnPostgresInterface } from '@core/interfaces';

export type DeleteColumnInterface<DT extends DatabasesTypes | undefined = undefined> =
	DT extends DatabasesTypes.POSTGRES ? DeleteColumnPostgresInterface :
		DT extends DatabasesTypes.MYSQL ? DeleteColumnMysqlInterface :
			never;