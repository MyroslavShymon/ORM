import { TriggerEventsTypes, TriggerTimingsTypes } from '@core/enums';

export interface BaseTriggerInterface {
	id?: string,
	name: string,
	timing: TriggerTimingsTypes,
	event: TriggerEventsTypes,
	tableName: string
	triggerFunction: string
}