import { DatabasesTypes } from '@core/enums';
import { DataSourceInterface } from '@core/interfaces';

export interface CheckTableExistenceOptionsInterface<DT extends DatabasesTypes> {
	dataSource: DataSourceInterface<DT>,
	tableName: string,
	tableSchema?: string,
}