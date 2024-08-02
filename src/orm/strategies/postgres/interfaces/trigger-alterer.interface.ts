import { TriggerInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';
import { DropTriggerInterface } from '@core/interfaces/triggers-manager';

export interface TriggerAltererInterface {
	createTrigger(trigger: TriggerInterface<DatabasesTypes.POSTGRES>): string;

	dropTrigger(parameters: DropTriggerInterface<DatabasesTypes.POSTGRES>): string;
}