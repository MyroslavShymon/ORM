import { TableManipulation } from '@context/table-manipulation';
import { TableCreator } from '@context/table-creator/table-creator';
import { DataSourceInterface, SqlClientInterface } from '@core/interfaces';
import { ConnectionData } from '@core/types';
import { MigrationManager } from '@context/migration-manager';
import { QueryBuilder } from '@context/query-builder';
import {
	CacheInterface,
	DataSourceContextInterface,
	EventManagerInterface,
	MigrationManagerInterface,
	QueryBuilderInterface,
	TableCreatorInterface,
	TableManipulationInterface,
	TransactionManagerInterface
} from '@context/common';
import { DatabasesTypes } from '@core/enums';
import { EventManager } from '@context/events';
import { TransactionManager } from '@context/transaction';

class DataSourceContext<DT extends DatabasesTypes> implements DataSourceContextInterface<DT> {
	private _dataSource: DataSourceInterface<DT>;
	private _client: SqlClientInterface;
	private _cache: CacheInterface;

	setDatabase(dataSource: DataSourceInterface<DT>): void {
		this._dataSource = dataSource;
	}

	setCache(cache: CacheInterface): void {
		this._cache = cache;
	}

	async connectDatabase(connectionData: ConnectionData): Promise<void> {
		await this._dataSource.connect(connectionData);

		this._client = await this._dataSource.client;
	}

	async getCurrentTime(): Promise<Object> {
		const getCurrentTimestampQuery = this._dataSource.getCurrentTimestamp();

		return this._dataSource.client.query(getCurrentTimestampQuery);
	}

	async query(sql: string, params: any[]): Promise<Object> {
		return await this._dataSource.client.query(sql, params);
	}

	get client(): SqlClientInterface {
		return this._client;
	}

	queryBuilder<T>(): QueryBuilderInterface<T> {
		return new QueryBuilder<T, DT>(this._dataSource, this.query, this._cache);
	}

	get tableManipulation(): TableManipulationInterface<DT> {
		return new TableManipulation(this._dataSource);
	}

	get tableCreator(): TableCreatorInterface<DT> {
		return new TableCreator<DT>(this._dataSource);
	}

	get migrationManager(): MigrationManagerInterface<DT> {
		return new MigrationManager(this._dataSource);
	}

	get eventManager(): EventManagerInterface {
		return new EventManager(this._cache);
	}

	get transactionManager(): TransactionManagerInterface {
		return new TransactionManager(this._dataSource);
	}
}

export { DataSourceContext };