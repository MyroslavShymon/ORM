import 'reflect-metadata';
import { DatabaseIngotInterface, DatabaseManagerInterface, DataSourceInterface } from '@core/interfaces';
import { ConnectionData } from '@core/types';
import { DatabasesTypes } from '@core/enums';
import { DataSourcePostgres } from '@strategies/postgres';
import { DataSourceMySql } from '@strategies/mysql';
import {
	CacheInterface,
	DataSourceContextInterface,
	EventManagerInterface,
	QueryBuilderInterface,
	TableCreatorInterface,
	TableManipulationInterface,
	TriggerManagerInterface
} from '@context/common';
import { FileStructureManager } from '@context/file-structure-manager';
import { ErrorHandler } from '@context/error-handler';
import { constants } from '@core/constants';
import { CacheFactory } from '@context/cache';
import { Logger, LoggerInterface, Monitoring, MonitoringInterface } from './monitoring';
import { Sanitizer } from '@utils/sanitizer';

class DatabaseManager<DT extends DatabasesTypes> implements DatabaseManagerInterface<DT> {
	private _connectionData: ConnectionData;
	private _dataSource: DataSourceContextInterface<DT>;
	private _cache: CacheInterface;
	private readonly _logger: LoggerInterface;
	private readonly _monitoring: MonitoringInterface<DT>;

	constructor(connectionData: ConnectionData, dataSource: DataSourceContextInterface<DT>) {
		this._connectionData = this._handleConnectionData(connectionData);
		this._dataSource = dataSource;
		this._dataSource.connectionData = this._connectionData;

		if (connectionData.logging) {
			this._logger = new Logger();
			this._dataSource.logger = new Logger();
		}

		if (connectionData.monitoring) {
			this._monitoring = new Monitoring();
			this._dataSource.monitoring = new Monitoring();
		}

		if (connectionData.type === DatabasesTypes.POSTGRES) {
			this._dataSource.database = new DataSourcePostgres() as unknown as DataSourceInterface<DT>;
		}

		if (this._connectionData.type === DatabasesTypes.MYSQL) {
			this._dataSource.database = new DataSourceMySql() as unknown as DataSourceInterface<DT>;
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

			const databaseIngot: DatabaseIngotInterface<DT> = { tables: [], triggers: [], indexes: [] };

			await this._dataSource.connectDatabase(this._connectionData);

			const isMigrationTableExist = await this._dataSource.migrationManager.checkTableExistence({
				tableName: this._connectionData.migrationTable,
				tableSchema: this._connectionData.migrationTableSchema
			});

			if (!isMigrationTableExist) {
				// await this._dataSource.query('use first');
				await this._dataSource.migrationManager.createMigrationTable({
					tableName: this._connectionData.migrationTable,
					tableSchema: this._connectionData.migrationTableSchema,
					databaseName: this._connectionData.database
				});

				await this._dataSource.migrationManager.initCurrentDatabaseIngot({
					databaseName: this._connectionData.database,
					tableName: this._connectionData.migrationTable,
					tableSchema: this._connectionData.migrationTableSchema,
					databaseIngot
				});
			}

			const tablesIngot = await this._dataSource.tableCreator.createIngotOfTables(this._connectionData);
			const triggersIngot = await this._dataSource.triggerCreator.createIngotOfTrigger(this._connectionData);
			const indexesIngot = await this._dataSource.indexCreator.createIngotOfIndex(this._connectionData);

			if (!tablesIngot.length) {
				const results = await this._dataSource.getCurrentTime();
				console.log('Database is work, current timestamp: ', results);
			}

			databaseIngot.tables = tablesIngot || [];
			databaseIngot.triggers = triggersIngot || [];
			databaseIngot.indexes = indexesIngot || [];

			await this._dataSource.migrationManager.syncDatabaseIngot({
				databaseName: this._connectionData.database,
				tableName: this._connectionData.migrationTable,
				tableSchema: this._connectionData.migrationTableSchema,
				databaseIngot
			});

			if (this._connectionData.cache) {
				this._cache = await CacheFactory.createCache(this._connectionData.cache.type, this._connectionData.cache.options);
				this._dataSource.cache = this._cache;
			}
		} catch (error) {
			console.error('Error while creating orm connection', error);
			ErrorHandler.handleCreateOrmConnection(error);
		} finally {
			// await this._dataSource.client.release();
		}
	}

	private _handleConnectionData(connectionData: ConnectionData) {
		connectionData.migrationTable = connectionData.migrationTable || constants.migrationsTableName;
		connectionData.migrationTableSchema = connectionData.migrationTableSchema || constants.migrationsTableSchemaName;

		return connectionData;
	}

	async query<T>(sql: string, params?: any[]): Promise<T> {
		try {
			if (this._connectionData.sanitizer)
				params = params.map(parameter => Sanitizer.sanitize(parameter));
			const operation = () => this._dataSource.query<T>(sql, params);

			const response = this._monitoring
				? await this._monitoring.measureExecutionTime<T>(operation, sql, params)
				: await operation();

			if (this._logger)
				this._logger.log(JSON.stringify(response), sql, JSON.stringify(params));
			return response;
		} catch (error) {
			console.error('Error while querying', error);
			if (this._logger)
				this._logger.error(JSON.stringify(error), sql, JSON.stringify(params));
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

	get eventManager(): EventManagerInterface {
		return this._dataSource.eventManager;
	}

	get triggerManager(): TriggerManagerInterface<DT> {
		return this._dataSource.triggerManager;
	}

	get logger(): LoggerInterface {
		return this._logger;
	}

	queryBuilder<T>(): QueryBuilderInterface<T> {
		return this._dataSource.queryBuilder<T>();
	}

	async transaction(callback: (trx: DatabaseManagerInterface<DT>) => Promise<void>): Promise<void> {
		await this._dataSource.transactionManager.beginTransaction();
		try {
			await callback(this);
			await this._dataSource.transactionManager.commit();
		} catch (error) {
			await this._dataSource.transactionManager.rollback();
			throw error;
		}
	}
}

export { DatabaseManager };