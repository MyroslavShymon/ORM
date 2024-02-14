import { TableIngotInterface } from '@core/interfaces/table-ingot.interface';
import { DataSourceInterface } from '@core/interfaces/data-source.interface';

export interface DatabaseIngotInterface {
	tables: TableIngotInterface<DataSourceInterface>[];
}