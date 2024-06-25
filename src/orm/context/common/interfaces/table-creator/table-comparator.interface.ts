import { TableIngotInterface } from '@core/interfaces';
import { TablePercentageInterface } from '@context/common';
import { DatabasesTypes } from '@core/enums';

export interface TableComparatorInterface<DT extends DatabasesTypes> {
	calculatePercentagesOfTablesWithModifiedState(
		newTables: TableIngotInterface<DatabasesTypes.POSTGRES>[],
		deletedTables: TableIngotInterface<DatabasesTypes.POSTGRES>[]
	): TablePercentageInterface<DatabasesTypes.POSTGRES>[];
}