import { TableIngotInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';

export interface DatabaseStateInterface<DT extends DatabasesTypes> {
	tablesWithOriginalNames: {
		table: TableIngotInterface<DT>
		model: TableIngotInterface<DT>
	}[];
	tablesWithModifiedState: {
		potentiallyDeletedTables: TableIngotInterface<DT>[],
		potentiallyNewTables: TableIngotInterface<DT>[]
	};
}