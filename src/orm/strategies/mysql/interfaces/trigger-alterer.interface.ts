import { TriggerInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';
import { DropTriggerInterface } from '@core/interfaces/triggers-manager';

export interface TriggerAltererInterface {
	createTrigger(trigger: TriggerInterface<DatabasesTypes.MYSQL>): string;

	dropTrigger(parameters: DropTriggerInterface<DatabasesTypes.MYSQL>): string;
}