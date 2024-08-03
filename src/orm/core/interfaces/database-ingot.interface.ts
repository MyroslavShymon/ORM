import { TableIngotInterface } from '@core/interfaces/table-ingot.interface';
import { DatabasesTypes } from '@core/enums';
import { IndexInterface, TriggerInterface } from '@core/interfaces/decorators';

export interface DatabaseIngotInterface<DT extends DatabasesTypes> {
	tables: TableIngotInterface<DT>[];
	triggers: TriggerInterface<DT>[];
	indexes: IndexInterface<DT>[];
}