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

		this._tableManipulation = new TableManipulation(connectionData, dataSource);
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

	get tableManipulation(): TableManipulation {
		return this._tableManipulation;
	}
}

export { DatabaseManager };