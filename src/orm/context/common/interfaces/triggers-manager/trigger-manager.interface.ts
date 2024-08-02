import { TriggerInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';
import { DropTriggerInterface } from '@core/interfaces/triggers-manager';

export interface TriggerManagerInterface<DT extends DatabasesTypes> {
	createTrigger<T extends boolean>(
		trigger: TriggerInterface<DT>,
		getString?: true
	): Promise<T extends true ? string : void>;

	dropTrigger<T extends boolean>(
		parameters: DropTriggerInterface<DT>,
		getString?: true
	): Promise<T extends true ? string : void>;
}