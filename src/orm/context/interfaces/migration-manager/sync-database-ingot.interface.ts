import { DatabaseIngotInterface } from '@core/interfaces';

export interface SyncDatabaseIngotInterface {
	tableName?: string;
	tableSchema?: string;
	databaseIngot: DatabaseIngotInterface;
	nameOfCurrentDatabaseIngot?: string;
}