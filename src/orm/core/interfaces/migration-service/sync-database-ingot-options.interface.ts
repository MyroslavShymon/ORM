import { DatabaseIngotInterface, DataSourceInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';

export interface SyncDatabaseIngotOptionsInterface<DT extends DatabasesTypes> {
	dataSource: DataSourceInterface<DT>,
	tableName: string,
	databaseIngot: DatabaseIngotInterface<DT>
	databaseName?: string,
	tableSchema?: string,
}