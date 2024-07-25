import { DataSourceInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';

export interface TransactionInterface {
	beginTransaction(dataSource: DataSourceInterface<DatabasesTypes.POSTGRES>): Promise<void>;

	commit(dataSource: DataSourceInterface<DatabasesTypes.POSTGRES>): Promise<void>;

	rollback(dataSource: DataSourceInterface<DatabasesTypes.POSTGRES>): Promise<void>;
}