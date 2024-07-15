import { TableIngotInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';

export interface TableCreationProcessorInterface<DT extends DatabasesTypes> {
	processingTablesWithModifiedState(
		potentiallyNewTables: TableIngotInterface<DT>[],
		potentiallyDeletedTables: TableIngotInterface<DT>[]
	): TableIngotInterface<DT>[];

	processingNewTables(newTables: TableIngotInterface<DT>[])
		: TableIngotInterface<DT>[];

	processingOriginalTables(potentialTables: {
		table: TableIngotInterface<DT>
		model: TableIngotInterface<DT>
	}[]): TableIngotInterface<DT>[];
}