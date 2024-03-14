import { DataSourceInterface } from '@core/interfaces';
import { constants } from '@core/constants';
import {
	CheckTableExistenceOptionsInterface,
	CreateMigrationTableOptionsInterface,
	InitIngotOptionsInterface,
	MigrationManagerInterface,
	SyncDatabaseIngotInterface
} from '@context/common';

export class MigrationManager implements MigrationManagerInterface {
	private readonly _dataSource: DataSourceInterface;

	constructor(dataSource: DataSourceInterface) {
		this._dataSource = dataSource;
	}

	async createMigrationTable(
		{
			tableName = constants.migrationsTableName,
			tableSchema = constants.migrationsTableSchemaName
		}: CreateMigrationTableOptionsInterface
	): Promise<void> {
		try {
			const createMigrationTableQuery = this._dataSource.createMigrationTable(tableName, tableSchema);
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
		}: CheckTableExistenceOptionsInterface
	): Promise<boolean> {
		try {
			return this._dataSource.checkTableExistence(this._dataSource, tableName, tableSchema);
		} catch (error) {
			console.error('Error checking the existence of the table:', error);
			throw error;
		}
	}

	async initCurrentDatabaseIngot(
		{
			tableName = constants.migrationsTableName,
			tableSchema = constants.migrationsTableSchemaName,
			databaseIngot
		}: InitIngotOptionsInterface
	): Promise<void> {
		try {
			await this._dataSource.initCurrentDatabaseIngot(this._dataSource, tableName, tableSchema, databaseIngot);
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
			databaseIngot
		}: SyncDatabaseIngotInterface
	): Promise<void> {
		try {
			await this._dataSource.syncDatabaseIngot(this._dataSource, tableName, tableSchema, databaseIngot);
			console.log('Database in synced');
		} catch (error) {
			console.error('Error while synchronizing database ingot:', error);
			throw error;
		}
	}
}