import { DataSourceInterface, ModelInterface, TableIngotInterface } from '@core/interfaces';
import { DatabaseStateInterface } from '@context/interfaces';

export interface DatabaseStateBuilderInterface {
	getPreparedModels(models: ModelInterface[]): TableIngotInterface<DataSourceInterface>[];

	formationOfDatabaseState(
		preparedModels: TableIngotInterface<DataSourceInterface>[],
		currentTablesIngot: TableIngotInterface<DataSourceInterface>[]
	): DatabaseStateInterface;
}