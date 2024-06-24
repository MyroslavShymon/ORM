import { DatabasesTypes } from '@core/enums';
import { AddUniqueToColumnMysqlInterface } from '@core/interfaces';
import {
	AddUniqueToColumnPostgresInterface
} from '@core/interfaces/table-manipuldation/postgres/add-unique-to-column-postgres.interface';

export type AddUniqueToColumnInterface<DT extends DatabasesTypes | undefined = undefined> =
	DT extends DatabasesTypes.POSTGRES ? AddUniqueToColumnPostgresInterface :
		DT extends DatabasesTypes.MYSQL ? AddUniqueToColumnMysqlInterface :
			never;