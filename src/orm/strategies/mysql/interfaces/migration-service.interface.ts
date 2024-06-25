import { DatabaseIngotInterface, DataSourceInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';

export interface MigrationServiceInterface<DT extends DatabasesTypes> {
	createMigrationTable(tableName: string, tableSchema: string): string;

	checkTableExistence(dataSource: DataSourceInterface<DatabasesTypes.MYSQL>, tableName: string, tableSchema?: string): Promise<boolean>;

	initCurrentDatabaseIngot(
		dataSource: DataSourceInterface<DatabasesTypes.MYSQL>,
		tableName: string,
		tableSchema: string,
		databaseIngot: DatabaseIngotInterface<DatabasesTypes.MYSQL>
	): Promise<void>;

	syncDatabaseIngot(
		dataSource: DataSourceInterface<DatabasesTypes.MYSQL>,
		tableName: string,
		tableSchema: string,
		databaseIngot: DatabaseIngotInterface<DatabasesTypes.MYSQL>
	): Promise<void>;

	getCurrentDatabaseIngot(
		dataSource: DataSourceInterface<DatabasesTypes.MYSQL>,
		tableName: string,
		tableSchema: string
	): Promise<DatabaseIngotInterface<DatabasesTypes.MYSQL>>;
}