import { ConnectionData } from '@core/types';
import { TriggerInterface } from '@core/interfaces';

export interface TriggerCreatorInterface {
	createIngotOfTrigger(connectionData: ConnectionData): Promise<TriggerInterface[]>;
}