import 'reflect-metadata';
import { DatabaseIngotInterface, DatabaseManagerInterface } from '@core/interfaces';
import { ConnectionClient, ConnectionData } from '@core/types';
import { DatabasesTypes } from '@core/enums';
import { DataSourcePostgres } from '@strategies/postgres';
import { DataSourceMySql } from '@strategies/mysql';
import {
	DataSourceContextInterface,
	QueryBuilderInterface,
	TableCreatorInterface,
	TableManipulationInterface
} from '@context/interfaces';

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

	async connectDatabase(): Promise<void> {
		await this._dataSource.connectDatabase(this._connectionData);
	}

	async createOrmConnection(): Promise<ConnectionClient> {
		try {
			const databaseIngot: DatabaseIngotInterface = { tables: [] };

			await this._dataSource.connectDatabase(this._connectionData);

			const isMigrationTableExist = await this._dataSource.migrationManager.checkTableExistence({
				tableName: this._connectionData.migrationTable,
				tableSchema: this._connectionData.migrationTableSchema
			});

			if (!isMigrationTableExist) {
				await this._dataSource.migrationManager.createMigrationTable({
					tableName: this._connectionData.migrationTable,
					tableSchema: this._connectionData.migrationTableSchema
				});

				await this._dataSource.migrationManager.initCurrentDatabaseIngot({
					tableName: this._connectionData.migrationTable,
					tableSchema: this._connectionData.migrationTableSchema,
					databaseIngot
				});
			}

			if (!this._connectionData.models) {
				const results = await this._dataSource.getCurrentTime();
				console.log('Database is work, current timestamp: ', results);
				return;
			}

			if (this._connectionData.models.length > 0) {
				databaseIngot.tables = await this._dataSource.tableCreator.createIngotOfTables(this._connectionData);
				console.log('Database ingot', databaseIngot);
			}

			await this._dataSource.migrationManager.syncDatabaseIngot({
				tableName: this._connectionData.migrationTable,
				tableSchema: this._connectionData.migrationTableSchema,
				databaseIngot
			});
		} catch (error) {
			console.error('error', error);
			throw Error(error);
		} finally {
			// await this._dataSource.client.release();
		}

		return {
			dataSource: this._dataSource,
			connectionData: this._connectionData
		};
	}

	async query(sql: string): Promise<Object> {
		return this._dataSource.query(sql);
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

	get tableManipulation(): TableManipulationInterface {
		return this._dataSource.tableManipulation;
	}

	get tableCreator(): TableCreatorInterface {
		return this._dataSource.tableCreator;
	}

	queryBuilder<T>(): QueryBuilderInterface<T> {
		return this._dataSource.queryBuilder<T>();
	}
}

export { DatabaseManager };