import { DataSourceInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';

export class Transaction {
	async beginTransaction(dataSource: DataSourceInterface<DatabasesTypes.POSTGRES>): Promise<void> {
		await dataSource.client.query('BEGIN');
	}

	async commit(dataSource: DataSourceInterface<DatabasesTypes.POSTGRES>): Promise<void> {
		await dataSource.client.query('COMMIT');
	}

	async rollback(dataSource: DataSourceInterface<DatabasesTypes.POSTGRES>): Promise<void> {
		await dataSource.client.query('ROLLBACK');
	}
}