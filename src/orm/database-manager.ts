import 'reflect-metadata';
import { ConnectionClient, ConnectionData } from './types';
import { DatabasesTypes } from './enums';
import { DataSourcePostgres } from './data-source-postgres';
import { DataSourceMySql } from './data-source-mysql';
import { DataSourceContext } from './data-source-context';
import { DatabaseManagerInterface } from './interfaces';
import { TableManipulation } from './table-manipulation';

class DatabaseManager implements DatabaseManagerInterface {
	_connectionData: ConnectionData;
	_dataSource: DataSourceContext;

	_tableManipulation: TableManipulation;

	constructor(connectionData: ConnectionData, dataSource: DataSourceContext) {
		this._connectionData = connectionData;
		this._dataSource = dataSource;

		if (connectionData.type === DatabasesTypes.POSTGRES) {
			this._dataSource.setDatabase(new DataSourcePostgres());
		}

		if (this._connectionData.type === DatabasesTypes.MYSQL) {
			this._dataSource.setDatabase(new DataSourceMySql());
		}

		this._tableManipulation = new TableManipulation(connectionData, dataSource);
	}

	async connection(): Promise<ConnectionClient> {
		try {
			await this._dataSource.connectDatabase(this._connectionData);
			if (this._connectionData.entities)
				await this._dataSource.createTables(this._connectionData.entities);

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

	set dataSource(dataSource: DataSourceContext) {
		this._dataSource = dataSource;
	}

	get connectionData(): ConnectionData {
		return this._connectionData;
	}

	get dataSource(): DataSourceContext {
		return this._dataSource;
	}

	get tableManipulation(): TableManipulation {
		return this._tableManipulation;
	}
}

export { DatabaseManager };