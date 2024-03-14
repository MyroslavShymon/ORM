import { TableIngotInterface } from '@core/interfaces';
import { DataSourcePostgres } from '@strategies/postgres';
import { TablePercentageInterface } from '@context/common';

export interface TableComparatorInterface {
	calculatePercentagesOfTablesWithModifiedState(
		newTables: TableIngotInterface<DataSourcePostgres>[],
		deletedTables: TableIngotInterface<DataSourcePostgres>[]
	): TablePercentageInterface[];
}