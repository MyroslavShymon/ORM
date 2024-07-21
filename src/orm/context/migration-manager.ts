import { DataSourceInterface } from '@core/interfaces';
import { constants } from '@core/constants';
import { DatabasesTypes } from '@core/enums';
import {
	CheckTableExistenceManagersOptionsInterface,
	CreateMigrationTableManagersOptionsInterface,
	InitDatabaseIngotManagersOptionsInterface,
	MigrationManagerInterface,
	SyncIngotManagersOptionsInterface
} from '@context/common/interfaces/migration-manager';
import { ConnectionData } from '@core/types';

export class MigrationManager<DT extends DatabasesTypes> implements MigrationManagerInterface<DT> {
	private readonly _dataSource: DataSourceInterface<DT>;
	private readonly _connectionData: ConnectionData;

	constructor(dataSource: DataSourceInterface<DT>) {
		this._dataSource = dataSource;
	}

	async createMigrationTable(
		{
			tableName = constants.migrationsTableName,
			tableSchema = constants.migrationsTableSchemaName,
			...options
		}: CreateMigrationTableManagersOptionsInterface
	): Promise<void> {
		try {
			const createMigrationTableQuery = this._dataSource.createMigrationTable({
				tableName,
				tableSchema, ...options
			});
			console.log('Create migration table Sql query', createMigrationTableQuery);
			await this._dataSource.client.query(createMigrationTableQuery);
			console.log(`Migration table with name ${tableName} and schema ${tableSchema} successfully created`);
		} catch (error) {
			console.error('Error when creating the migration table:', error);
			throw error;
		}
	}

	async checkTableExistence(
		{
			tableName = constants.migrationsTableName,
			tableSchema = constants.migrationsTableSchemaName
		}: CheckTableExistenceManagersOptionsInterface
	): Promise<boolean> {
		try {
			return this._dataSource.checkTableExistence({ dataSource: this._dataSource, tableName, tableSchema });
		} catch (error) {
			console.error('Error checking the existence of the table:', error);
			throw error;
		}
	}

	async initCurrentDatabaseIngot(
		{
			tableName = constants.migrationsTableName,
			tableSchema = constants.migrationsTableSchemaName,
			...options
		}: InitDatabaseIngotManagersOptionsInterface<DT>
	): Promise<void> {
		try {
			await this._dataSource.initCurrentDatabaseIngot({
				dataSource: this._dataSource,
				tableName,
				tableSchema,
				...options
			});
			console.log('Init current table ingot');
		} catch (error) {
			console.error('Error initializing the current database ingot:', error);
			throw error;
		}
	}

	async syncDatabaseIngot(
		{
			tableName = constants.migrationsTableName,
			tableSchema = constants.migrationsTableSchemaName,
			...options
		}: SyncIngotManagersOptionsInterface<DT>
	): Promise<void> {
		try {
			await this._dataSource.syncDatabaseIngot({
				dataSource: this._dataSource,
				tableName,
				tableSchema, ...options
			});
			console.log('Database in synced');
		} catch (error) {
			console.error('Error while synchronizing database ingot:', error);
			throw error;
		}
	}
}