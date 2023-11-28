import { DataSourceInterface, ModelInterface } from '@core/interfaces';
import { TableIngotInterface } from '@core/interfaces/table-ingot.interface';

export interface TableCreatorInterface {
	createTables(models: ModelInterface[]): Promise<TableIngotInterface<DataSourceInterface>[]>;
}