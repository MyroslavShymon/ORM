import { DatabasesTypes } from '@core/enums';
import {
	AddUniqueToColumnMysqlInterface,
	AddUniqueToColumnPostgresInterface,
	CommonAddUniqueToColumnInterface
} from '@core/interfaces';

export type AddUniqueToColumnInterface<DT extends DatabasesTypes> =
	DT extends DatabasesTypes.POSTGRES ? AddUniqueToColumnPostgresInterface :
		DT extends DatabasesTypes.MYSQL ? AddUniqueToColumnMysqlInterface :
			CommonAddUniqueToColumnInterface;