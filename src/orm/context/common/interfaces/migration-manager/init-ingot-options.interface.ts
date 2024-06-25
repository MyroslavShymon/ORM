import { DatabaseIngotInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';

export interface InitIngotOptionsInterface<DT extends DatabasesTypes> {
	tableName?: string;
	tableSchema?: string;
	databaseIngot: DatabaseIngotInterface<DT>;
	nameOfCurrentDatabaseIngot?: string;
}