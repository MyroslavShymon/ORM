import { DataSourceInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';
import { TransactionManagerInterface } from '@context/common';

export class TransactionManager<DT extends DatabasesTypes> implements TransactionManagerInterface {
	private readonly _dataSource: DataSourceInterface<DT>;

	constructor(dataSource: DataSourceInterface<DT>) {
		this._dataSource = dataSource;
	}

	async beginTransaction(): Promise<void> {
		await this._dataSource.beginTransaction(this._dataSource);
	}

	async commit(): Promise<void> {
		await this._dataSource.commit(this._dataSource);
	}

	async rollback(): Promise<void> {
		await this._dataSource.rollback(this._dataSource);
	}
}