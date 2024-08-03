import { BaseTriggerInterface } from '@core/interfaces';

export interface TriggerPostgresInterface extends BaseTriggerInterface {
	triggerFunctionName: string;
}