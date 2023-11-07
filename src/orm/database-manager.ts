import 'reflect-metadata';
import { ConnectionData } from './types/connection-data';
import { DatabasesTypes } from './enums/databases-types';
import { DataSourcePostgres } from './data-source-postgres';
import { DataSourceMySql } from './data-source-mysql';
import { DataSourceContext } from './data-source-context';
import { ConnectionClient } from './types/connection-client';
import { DatabaseManagerInterface } from './interfaces/database-manager.interface';

class DatabaseManager implements DatabaseManagerInterface {
	_connectionData: ConnectionData;
	_dataSource: DataSourceContext = new DataSourceContext();

	constructor(connectionData: ConnectionData) {
		this._connectionData = connectionData;
	}

	//check git
	async connection(): Promise<ConnectionClient> {
		if (this._connectionData.type === DatabasesTypes.POSTGRES) {
			this._dataSource.setDatabase(new DataSourcePostgres());

			try {
				await this._dataSource.connectDatabase(this._connectionData);
				if (this._connectionData.entities)
					await this._dataSource.createTables(this._connectionData.entities);

				if (!this._connectionData.entities) {
					const results = await this._dataSource.client.query('SELECT current_timestamp;');
					console.log('results', results);
				}
			} catch (error) {
				console.error('error', error);
			} finally {
				// await this._dataSource.client.release();
				console.log(`Table created successfully`);
			}
		}

		if (this._connectionData.type === DatabasesTypes.MYSQL) {
			this._dataSource.setDatabase(new DataSourceMySql());

			try {
				await this._dataSource.connectDatabase(this._connectionData);
				if (this._connectionData.entities)
					await this._dataSource.createTables(this._connectionData.entities);

				if (!this._connectionData.entities) {
					const results = await this._dataSource.client.query('SELECT NOW();');
					console.log('results', results);
				}
			} catch (error) {
				console.error('error', error);
			} finally {
				console.log(`Table created successfully`);
			}
		}

		return {
			dataSource: this._dataSource,
			connectionData: this._connectionData
		};
	}

	set connectionData(connectionData: ConnectionData) {
		this._connectionData = connectionData;
	}

	set dataSource(dataSource: DataSourceContext) {
		this._dataSource = dataSource;
	}

	get connectionData(): ConnectionData {
		return this._connectionData;
	}

	get dataSource(): DataSourceContext {
		return this._dataSource;
	}
}

export { DatabaseManager };