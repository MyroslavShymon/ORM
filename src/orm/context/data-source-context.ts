import { PoolClient } from 'pg';
import { Connection } from 'mysql2/promise';
import {
	DataSourceContextInterface,
	MigrationManagerInterface,
	TableCreatorInterface,
	TableManipulationInterface
} from '@context/interfaces';
import { TableManipulation } from '@context/table-manipulation';
import { TableCreator } from '@context/table-creator';
import { DataSourceInterface } from '@core/interfaces';
import { ConnectionData } from '@core/types';
import { DataSourcePostgres } from '@strategies/postgres';
import { MigrationManager } from '@context/migration-manager';

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

	get migrationManager(): MigrationManagerInterface {
		return new MigrationManager(this._dataSource);
	}
}

export { DataSourceContext };