import { DatabaseIngotInterface, DataSourceInterface } from '@core/interfaces';

export interface MigrationServiceInterface {
	createMigrationTable(tableName: string, tableSchema: string): string;

	checkTableExistence(dataSource: DataSourceInterface, tableName: string, tableSchema?: string): Promise<boolean>;

	initCurrentDatabaseIngot(
		dataSource: DataSourceInterface,
		tableName: string,
		tableSchema: string,
		databaseIngot: DatabaseIngotInterface
	): Promise<void>;

	syncDatabaseIngot(
		dataSource: DataSourceInterface,
		tableName: string,
		tableSchema: string,
		databaseIngot: DatabaseIngotInterface
	): Promise<void>;

	getCurrentDatabaseIngot(
		dataSource: DataSourceInterface,
		tableName: string,
		tableSchema: string
	): Promise<DatabaseIngotInterface>;
}