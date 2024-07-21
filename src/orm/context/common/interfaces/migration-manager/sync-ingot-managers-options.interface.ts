import { DatabasesTypes } from '@core/enums';
import { DatabaseIngotInterface } from '@core/interfaces';

export interface SyncIngotManagersOptionsInterface<DT extends DatabasesTypes> {
	databaseIngot: DatabaseIngotInterface<DT>;
	tableName?: string;
	tableSchema?: string;
	nameOfCurrentDatabaseIngot?: string;
	databaseName?: string,
}