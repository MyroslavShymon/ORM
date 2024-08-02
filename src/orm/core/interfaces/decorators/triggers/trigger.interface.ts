import { DatabasesTypes } from '@core/enums';
import { TriggerMysqlInterface, TriggerPostgresInterface } from '@core/interfaces';

export type TriggerInterface<DT extends DatabasesTypes | undefined = undefined> =
	DT extends DatabasesTypes.POSTGRES ? TriggerPostgresInterface :
		DT extends DatabasesTypes.MYSQL ? TriggerMysqlInterface :
			never;


