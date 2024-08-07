import { TriggerEventsTypes, TriggerTimingsTypes } from '@core/enums';

export interface TriggerMetadataInterface {
	name: string,
	timing: TriggerTimingsTypes,
	event: TriggerEventsTypes,
	tableName: string
	triggerFunction: string
	triggerFunctionName?: string
}