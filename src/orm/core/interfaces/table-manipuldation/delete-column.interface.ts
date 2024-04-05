import { DatabasesTypes } from '@core/enums';
import { DeleteColumnMysqlInterface, DeleteColumnPostgresInterface } from '@core/interfaces';

export type DeleteColumnInterface<DB, GT extends DatabasesTypes | undefined = undefined> =
	GT extends DatabasesTypes.POSTGRES ? DeleteColumnPostgresInterface :
		DeleteColumnMysqlInterface;