import { DataSourceInterface, TableIngotInterface } from '@core/interfaces';

export interface TableCreationProcessorInterface {
	processingTablesWithModifiedState(
		potentiallyNewTables: TableIngotInterface<DataSourceInterface>[],
		potentiallyDeletedTables: TableIngotInterface<DataSourceInterface>[]
	): TableIngotInterface<DataSourceInterface>[];

	processingNewTables(newTables: TableIngotInterface<DataSourceInterface>[])
		: TableIngotInterface<DataSourceInterface>[];

	processingOriginalTables(potentialTables: {
		table: TableIngotInterface<DataSourceInterface>
		model: TableIngotInterface<DataSourceInterface>
	}[]): TableIngotInterface<DataSourceInterface>[];
}