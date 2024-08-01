import { ClassInterface, TableIngotInterface } from '@core/interfaces';
import { DatabaseStateInterface } from '@context/common/interfaces';
import { DatabasesTypes } from '@core/enums';

export interface DatabaseStateBuilderInterface<DT extends DatabasesTypes> {
	getPreparedModels(models: ClassInterface[]): TableIngotInterface<DT>[];

	formationOfDatabaseState(
		preparedModels: TableIngotInterface<DT>[],
		currentTablesIngot: TableIngotInterface<DT>[]
	): DatabaseStateInterface<DT>;
}