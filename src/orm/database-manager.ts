import 'reflect-metadata';
import {
	DatabaseIngotInterface,
	DatabaseManagerInterface,
	DataSourceInterface,
	TableIngotInterface
} from '@core/interfaces';
import { ConnectionData } from '@core/types';
import { DatabasesTypes } from '@core/enums';
import { DataSourcePostgres } from '@strategies/postgres';
import { DataSourceMySql } from '@strategies/mysql';
import {
	DataSourceContextInterface,
	QueryBuilderInterface,
	TableCreatorInterface,
	TableManipulationInterface
} from '@context/common';
import { FileStructureManager } from '@context/file-structure-manager';
import { ErrorHandler } from '@context/error-handler';

class DatabaseManager<DT extends DatabasesTypes> implements DatabaseManagerInterface<DT> {
	private _connectionData: ConnectionData;
	private _dataSource: DataSourceContextInterface<DT>;

	constructor(connectionData: ConnectionData, dataSource: DataSourceContextInterface<DT>) {
		this._connectionData = connectionData;
		this._dataSource = dataSource;

		if (connectionData.type === DatabasesTypes.POSTGRES) {
			this._dataSource.setDatabase(new DataSourcePostgres() as DataSourceInterface<DT>);
		}

		if (this._connectionData.type === DatabasesTypes.MYSQL) {
			this._dataSource.setDatabase(new DataSourceMySql() as DataSourceInterface<DT>);
		}
	}

	async connectDatabase(): Promise<void> {
		try {
			await this._dataSource.connectDatabase(this._connectionData);
		} catch (error) {
			console.error('Error while connecting database', error);
		}
	}

	async createOrmConnection(): Promise<void> {
		try {
			FileStructureManager.manage(this._connectionData);

			const databaseIngot: DatabaseIngotInterface<DT> = { tables: [] };

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

			const tablesIngot = await this._dataSource.tableCreator.createIngotOfTables(this._connectionData);
			if (!tablesIngot.length) {
				const results = await this._dataSource.getCurrentTime();
				console.log('Database is work, current timestamp: ', results);
			}
			databaseIngot.tables = tablesIngot as TableIngotInterface<DT>[] || [];

			await this._dataSource.migrationManager.syncDatabaseIngot({
				tableName: this._connectionData.migrationTable,
				tableSchema: this._connectionData.migrationTableSchema,
				databaseIngot
			});
		} catch (error) {
			console.error('Error while creating orm connection', error);
			ErrorHandler.handleCreateOrmConnection(error);
		} finally {
			// await this._dataSource.client.release();
		}
	}

	async query(sql: string): Promise<Object> {
		try {
			return this._dataSource.query(sql);
		} catch (error) {
			console.error('Error while querying', error);
		}
	}

	set connectionData(connectionData: ConnectionData) {
		this._connectionData = connectionData;
	}

	set dataSource(dataSource: DataSourceContextInterface<DT>) {
		this._dataSource = dataSource;
	}

	get connectionData(): ConnectionData {
		return this._connectionData;
	}

	get tableManipulation(): TableManipulationInterface<DT> {
		return this._dataSource.tableManipulation;
	}

	get tableCreator(): TableCreatorInterface<DT> {
		return this._dataSource.tableCreator;
	}

	queryBuilder<T>(): QueryBuilderInterface<T> {
		return this._dataSource.queryBuilder<T>();
	}
}

export { DatabaseManager };