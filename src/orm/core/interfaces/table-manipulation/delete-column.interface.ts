import { DatabasesTypes } from '@core/enums';
import {
	CommonDeleteColumnInterface,
	DeleteColumnMysqlInterface,
	DeleteColumnPostgresInterface
} from '@core/interfaces';

export type DeleteColumnInterface<DT extends DatabasesTypes> =
	DT extends DatabasesTypes.POSTGRES ? DeleteColumnPostgresInterface :
		DT extends DatabasesTypes.MYSQL ? DeleteColumnMysqlInterface :
			CommonDeleteColumnInterface;