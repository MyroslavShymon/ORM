import { DataSourceInterface, TableIngotInterface } from '@core/interfaces';

export interface DatabaseStateInterface {
	tablesWithOriginalNames: {
		table: TableIngotInterface<DataSourceInterface>
		model: TableIngotInterface<DataSourceInterface>
	}[];
	tablesWithModifiedState: {
		potentiallyDeletedTables: TableIngotInterface<DataSourceInterface>[],
		potentiallyNewTables: TableIngotInterface<DataSourceInterface>[]
	};
}