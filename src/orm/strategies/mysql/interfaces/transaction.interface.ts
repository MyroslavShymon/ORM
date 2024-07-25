import { DatabasesTypes } from '@core/enums';
import { DataSourceInterface } from '@core/interfaces';

export interface TransactionInterface {
	beginTransaction(dataSource: DataSourceInterface<DatabasesTypes.MYSQL>): Promise<void>;

	commit(dataSource: DataSourceInterface<DatabasesTypes.MYSQL>): Promise<void>;

	rollback(dataSource: DataSourceInterface<DatabasesTypes.MYSQL>): Promise<void>;
}