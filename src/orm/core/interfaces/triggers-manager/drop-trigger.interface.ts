import { DatabasesTypes } from '@core/enums';
import { DropTriggerPostgresInterface } from '@core/interfaces/triggers-manager/drop-trigger-postgres.interface';
import { DropTriggerMysqlInterface } from '@core/interfaces/triggers-manager/drop-trigger-mysql.interface';

export type DropTriggerInterface<DT extends DatabasesTypes | undefined = undefined> =
	DT extends DatabasesTypes.POSTGRES ? DropTriggerPostgresInterface :
		DT extends DatabasesTypes.MYSQL ? DropTriggerMysqlInterface :
			never;
