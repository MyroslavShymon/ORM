import { DatabasesTypes } from '@core/enums';
import { BaseTriggerInterface, TriggerMysqlInterface, TriggerPostgresInterface } from '@core/interfaces';

export type TriggerInterface<DT extends DatabasesTypes | undefined = undefined> =
	DT extends DatabasesTypes.POSTGRES ? TriggerPostgresInterface :
		DT extends DatabasesTypes.MYSQL ? TriggerMysqlInterface :
			BaseTriggerInterface;


