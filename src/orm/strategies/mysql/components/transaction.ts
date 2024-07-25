import { DataSourceInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';
import { Connection } from 'mysql2/promise';
import { TransactionInterface } from '@strategies/mysql';

export class Transaction implements TransactionInterface {
	async beginTransaction(dataSource: DataSourceInterface<DatabasesTypes.MYSQL>): Promise<void> {
		const connection = dataSource.client as Connection;
		await connection.beginTransaction();
	}

	async commit(dataSource: DataSourceInterface<DatabasesTypes.MYSQL>): Promise<void> {
		const connection = dataSource.client as Connection;
		await connection.commit();
	}

	async rollback(dataSource: DataSourceInterface<DatabasesTypes.MYSQL>): Promise<void> {
		const connection = dataSource.client as Connection;
		await connection.rollback();
	}
}