import { TriggerEventsTypes, TriggerTimingsTypes } from '@core/enums';

export interface TriggerInterface {
	id?: string,
	name: string,
	timing: TriggerTimingsTypes,
	event: TriggerEventsTypes,
	tableName: string
	function: string
}