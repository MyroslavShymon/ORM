import { TriggerEventsTypes, TriggerTimingsTypes } from '@core/enums';

export interface TriggerPostgresInterface {
	id?: string,
	name: string,
	timing: TriggerTimingsTypes,
	event: TriggerEventsTypes,
	tableName: string
	function: string
	triggerFunctionName: string
}