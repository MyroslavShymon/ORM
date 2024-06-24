import { DatabasesTypes } from '@core/enums';
import { DropNotNullFromColumnMysqlInterface, DropNotNullFromColumnPostgresInterface } from '@core/interfaces';

export type DropNotNullFromColumnInterface<DT extends DatabasesTypes | undefined = undefined> =
	DT extends DatabasesTypes.POSTGRES ? DropNotNullFromColumnPostgresInterface :
		DT extends DatabasesTypes.MYSQL ? DropNotNullFromColumnMysqlInterface :
			never;