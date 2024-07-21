import { DataSourceInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';

export interface GetCurrentDatabaseIngotOptionsInterface<DT extends DatabasesTypes> {
	dataSource: DataSourceInterface<DT>,
	tableName: string,
	databaseName?: string,
	tableSchema?: string
}