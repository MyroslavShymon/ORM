import { PoolClient } from 'pg';
import { Connection } from 'mysql2/promise';
import { TableManipulation } from '@context/table-manipulation';
import { TableCreator } from '@context/table-creator/table-creator';
import { DataSourceInterface } from '@core/interfaces';
import { ConnectionData } from '@core/types';
import { MigrationManager } from '@context/migration-manager';
import { QueryBuilder } from '@context/query-builder';
import {
	DataSourceContextInterface,
	MigrationManagerInterface,
	QueryBuilderInterface,
	TableCreatorInterface,
	TableManipulationInterface
} from '@context/common';
import { DatabasesTypes } from '@core/enums';

class DataSourceContext<DT extends DatabasesTypes> implements DataSourceContextInterface<DT> {
	private _dataSource: DataSourceInterface<DT>;
	private _client: DT extends DatabasesTypes.POSTGRES ? PoolClient : Connection;

	setDatabase(dataSource: DataSourceInterface<DT>): void {
		this._dataSource = dataSource;
	}

	async connectDatabase(connectionData: ConnectionData): Promise<void> {
		await this._dataSource.connect(connectionData);

		this._client = await this._dataSource.client;
	}

	async getCurrentTime(): Promise<Object> {
		const getCurrentTimestampQuery = this._dataSource.getCurrentTimestamp();

		return this._dataSource.client.query(getCurrentTimestampQuery);
	}

	async query(sql: string): Promise<Object> {
		return await this._dataSource.client.query(sql);
	}

	get client(): DT extends DatabasesTypes.POSTGRES ? PoolClient : Connection {
		return this._client;
	}

	queryBuilder<T>(): QueryBuilderInterface<T> {
		return new QueryBuilder<T, DT>(this._dataSource, this.query);
	}

	get tableManipulation(): TableManipulationInterface<DT> {
		return new TableManipulation(this._dataSource);
	}

	get tableCreator(): TableCreatorInterface<DatabasesTypes.POSTGRES> {
		return new TableCreator<DatabasesTypes.POSTGRES>(this._dataSource as DataSourceInterface<DatabasesTypes.POSTGRES>);
	}

	get migrationManager(): MigrationManagerInterface<DT> {
		return new MigrationManager(this._dataSource);
	}
}

export { DataSourceContext };