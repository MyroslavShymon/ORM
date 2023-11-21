import 'reflect-metadata';
import { DatabaseManagerInterface } from '@core/interfaces';
import { ConnectionClient, ConnectionData } from '@core/types';
import { DatabasesTypes } from '@core/enums';
import { DataSourcePostgres } from '@strategies/postgres';
import { DataSourceMySql } from '@strategies/mysql';
import { DataSourceContextInterface, TableManipulationInterface } from '@context/interfaces';

class DatabaseManager implements DatabaseManagerInterface {
	private _connectionData: ConnectionData;
	private _dataSource: DataSourceContextInterface;

	constructor(connectionData: ConnectionData, dataSource: DataSourceContextInterface) {
		this._connectionData = connectionData;
		this._dataSource = dataSource;

		if (connectionData.type === DatabasesTypes.POSTGRES) {
			this._dataSource.setDatabase(new DataSourcePostgres());
		}

		if (this._connectionData.type === DatabasesTypes.MYSQL) {
			this._dataSource.setDatabase(new DataSourceMySql());
		}
	}

	async connection(): Promise<ConnectionClient> {
		try {
			await this._dataSource.connectDatabase(this._connectionData);
			if (this._connectionData.entities)
				await this._dataSource.tableCreator.createTables(this._connectionData.entities);

			if (!this._connectionData.entities) {
				const results = await this._dataSource.getCurrentTime();
				console.log('Database is work, current timestamp: ', results);
			}
		} catch (error) {
			console.error('error', error);
		} finally {
			// await this._dataSource.client.release();
			console.log(`Table created successfully`);
		}

		return {
			dataSource: this._dataSource,
			connectionData: this._connectionData
		};
	}

	set connectionData(connectionData: ConnectionData) {
		this._connectionData = connectionData;
	}

	set dataSource(dataSource: DataSourceContextInterface) {
		this._dataSource = dataSource;
	}

	get connectionData(): ConnectionData {
		return this._connectionData;
	}

	get dataSource(): DataSourceContextInterface {
		return this._dataSource;
	}

	get tableManipulation(): TableManipulationInterface {
		return this._dataSource.tableManipulation;
	}
}

export { DatabaseManager };