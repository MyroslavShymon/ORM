import { DatabasesTypes } from '@core/enums';
import { ComputedColumnMysqlInterface, ComputedColumnPostgresInterface } from '@core/interfaces';

export type AddComputedColumnInterface<DT extends DatabasesTypes> =
	DT extends DatabasesTypes.POSTGRES ? ComputedColumnPostgresInterface :
		DT extends DatabasesTypes.MYSQL ? ComputedColumnMysqlInterface :
			never;