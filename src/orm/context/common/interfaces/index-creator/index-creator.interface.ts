import { ConnectionData } from '@core/types';
import { IndexInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';

export interface IndexCreatorInterface<DT extends DatabasesTypes> {
	createIngotOfIndex(connectionData: ConnectionData): Promise<IndexInterface<DT>[]>;
}