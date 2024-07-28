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
import { LoggerInterface, MonitoringInterface } from '../monitoring';

class DataSourceContext<DT extends DatabasesTypes> implements DataSourceContextInterface<DT> {
	private _dataSource: DataSourceInterface<DT>;
	private _client: SqlClientInterface;
	private _cache: CacheInterface;
	private _connectionData: ConnectionData;
	private _logger: LoggerInterface;
	private _monitoring: MonitoringInterface;

	set database(dataSource: DataSourceInterface<DT>) {
		this._dataSource = dataSource;
	}

	set monitoring(monitoring: MonitoringInterface) {
		this._monitoring = monitoring;
	}

	set cache(cache: CacheInterface) {
		this._cache = cache;
	}

	set connectionData(connectionData: ConnectionData) {
		this._connectionData = connectionData;
	}

	set logger(logger: LoggerInterface) {
		this._logger = logger;
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
		return new QueryBuilder<T, DT>(this._dataSource, this._connectionData, this.query, this._cache, this._logger, this._monitoring);
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