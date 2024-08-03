import { DatabasesTypes } from '@core/enums';

export interface IngotInterface<DT extends DatabasesTypes> {
	id?: string;
	tableName?: string;

	[key: string]: any;
}