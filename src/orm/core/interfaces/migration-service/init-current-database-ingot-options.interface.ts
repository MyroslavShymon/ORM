import { DatabasesTypes } from '@core/enums';
import { DatabaseIngotInterface, DataSourceInterface } from '@core/interfaces';

export interface InitCurrentDatabaseIngotOptionsInterface<DT extends DatabasesTypes> {
	dataSource: DataSourceInterface<DT>,
	tableName: string,
	databaseIngot: DatabaseIngotInterface<DT>,
	databaseName?: string,
	tableSchema?: string,
}