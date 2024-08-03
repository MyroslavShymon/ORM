import { TriggerEventsTypes, TriggerTimingsTypes } from '@core/enums';
import { ClassInterface } from '@core/interfaces';

export interface TriggerDecoratorInterface {
	name: string,
	timing: TriggerTimingsTypes,
	event: TriggerEventsTypes,
	triggerFunction?: string
	tableName?: string
	functionName?: string
	functions?: ClassInterface
	triggerFunctionName?: string //Postgres
}