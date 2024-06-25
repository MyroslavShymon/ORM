import { TableIngotInterface } from '@core/interfaces/table-ingot.interface';
import { DatabasesTypes } from '@core/enums';

export interface DatabaseIngotInterface<DT extends DatabasesTypes> {
	tables: TableIngotInterface<DT>[];
}