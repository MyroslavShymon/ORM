import { DatabaseIngotInterface } from '@core/interfaces';

export interface InitIngotOptionsInterface {
	tableName?: string;
	tableSchema?: string;
	databaseIngot: DatabaseIngotInterface;
	nameOfCurrentDatabaseIngot?: string;
}