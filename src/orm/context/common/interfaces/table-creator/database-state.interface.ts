import { TableIngotInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';

export interface DatabaseStateInterface<DT extends DatabasesTypes> {
	tablesWithOriginalNames: {
		table: TableIngotInterface<DatabasesTypes.POSTGRES>
		model: TableIngotInterface<DatabasesTypes.POSTGRES>
	}[];
	tablesWithModifiedState: {
		potentiallyDeletedTables: TableIngotInterface<DatabasesTypes.POSTGRES>[],
		potentiallyNewTables: TableIngotInterface<DatabasesTypes.POSTGRES>[]
	};
}