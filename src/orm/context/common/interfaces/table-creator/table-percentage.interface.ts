import { TableIngotInterface } from '@core/interfaces';
import { DataSourcePostgres } from '@strategies/postgres';

export interface TablePercentageInterface {
	newTable: TableIngotInterface<DataSourcePostgres>,
	deletedTable: TableIngotInterface<DataSourcePostgres>,
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

// npm install -g .
//npm run build
//orm-cli --migration:create init