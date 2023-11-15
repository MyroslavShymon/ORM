import { PoolClient } from 'pg';
import { Connection } from 'mysql2/promise';
import { DataSourceContextInterface, DataSourceInterface, TableManipulationInterface } from '../../interfaces';
import { DataSourcePostgres } from '../strategies/postgres/data-source-postgres';
import { ConnectionData } from '../../types';
import { TableManipulation } from './table-manipulation';
import { TableCreator } from './table-creator';
import { TableCreatorInterface } from './interfaces';

class DataSourceContext implements DataSourceContextInterface {
	private _dataSource: DataSourceInterface;
	private _client: DataSourceInterface extends DataSourcePostgres ? PoolClient : Connection;

	setDatabase(dataSource: DataSourceInterface): void {
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

	get client(): DataSourceInterface extends DataSourcePostgres ? PoolClient : Connection {
		return this._client;
	}

	get tableManipulation(): TableManipulationInterface {
		return new TableManipulation(this._dataSource);
	}

	get tableCreator(): TableCreatorInterface {
		return new TableCreator(this._dataSource);
	}
}

export { DataSourceContext };