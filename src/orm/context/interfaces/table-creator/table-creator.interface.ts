import { DataSourceInterface, ModelInterface } from '@core/interfaces';
import { TableIngotInterface } from '@core/interfaces/table-ingot.interface';

export interface TableCreatorInterface {
	createIngotOfTables(models: ModelInterface[]): TableIngotInterface<DataSourceInterface>[];

	generateCreateTableQuery(ingotsOfTables: TableIngotInterface<DataSourceInterface>[]): string;
}