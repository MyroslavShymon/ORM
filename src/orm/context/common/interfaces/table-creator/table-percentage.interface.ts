import { TableIngotInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';

export interface TablePercentageInterface<DT extends DatabasesTypes> {
	newTable: TableIngotInterface<DatabasesTypes.POSTGRES>,
	deletedTable: TableIngotInterface<DatabasesTypes.POSTGRES>,
	percentages: {
		columnsPercentage?: number
		computedColumnPercentage?: number
		optionsPercentage?: number
		constraintsPercentage?: number
		foreignKeyPercentage?: number
		primaryKeyPercentage?: number
		oneToOnePercentage?: number
		oneToManyPercentage?: number
		manyToManyPercentage?: number
	}
}