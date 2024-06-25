import { TableIngotInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';

export interface TableCreationProcessorInterface<DT extends DatabasesTypes> {
	processingTablesWithModifiedState(
		potentiallyNewTables: TableIngotInterface<DatabasesTypes.POSTGRES>[],
		potentiallyDeletedTables: TableIngotInterface<DatabasesTypes.POSTGRES>[]
	): TableIngotInterface<DatabasesTypes.POSTGRES>[];

	processingNewTables(newTables: TableIngotInterface<DatabasesTypes.POSTGRES>[])
		: TableIngotInterface<DatabasesTypes.POSTGRES>[];

	processingOriginalTables(potentialTables: {
		table: TableIngotInterface<DatabasesTypes.POSTGRES>
		model: TableIngotInterface<DatabasesTypes.POSTGRES>
	}[]): TableIngotInterface<DatabasesTypes.POSTGRES>[];
}