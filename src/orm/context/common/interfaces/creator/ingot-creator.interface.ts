import { ConnectionData } from '@core/types';

export interface IngotCreatorInterface<T> {
	createIngot(connectionData: ConnectionData): Promise<T[]>;
}