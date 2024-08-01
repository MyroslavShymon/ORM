import { TriggerEventsTypes, TriggerTimingsTypes } from '@core/enums';

export interface TriggerInterface {
	name: string,
	timing: TriggerTimingsTypes,
	event: TriggerEventsTypes,
	tableName: string
	function: string
}