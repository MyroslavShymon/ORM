import { ModelInterface, TableIngotInterface } from '@core/interfaces';
import { DatabaseStateInterface } from '@context/common/interfaces';
import { DatabasesTypes } from '@core/enums';

export interface DatabaseStateBuilderInterface<DT extends DatabasesTypes> {
	getPreparedModels(models: ModelInterface[]): TableIngotInterface<DatabasesTypes.POSTGRES>[];

	formationOfDatabaseState(
		preparedModels: TableIngotInterface<DatabasesTypes.POSTGRES>[],
		currentTablesIngot: TableIngotInterface<DatabasesTypes.POSTGRES>[]
	): DatabaseStateInterface<DatabasesTypes.POSTGRES>;
}