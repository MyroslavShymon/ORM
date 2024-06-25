import { DatabaseIngotInterface, DataSourceInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';

export interface MigrationServiceInterface<DT extends DatabasesTypes> {
	createMigrationTable(tableName: string, tableSchema: string): string;

	checkTableExistence(dataSource: DataSourceInterface<DatabasesTypes.POSTGRES>, tableName: string, tableSchema?: string): Promise<boolean>;

	initCurrentDatabaseIngot(
		dataSource: DataSourceInterface<DatabasesTypes.POSTGRES>,
		tableName: string,
		tableSchema: string,
		databaseIngot: DatabaseIngotInterface<DatabasesTypes.POSTGRES>
	): Promise<void>;

	syncDatabaseIngot(
		dataSource: DataSourceInterface<DatabasesTypes.POSTGRES>,
		tableName: string,
		tableSchema: string,
		databaseIngot: DatabaseIngotInterface<DatabasesTypes.POSTGRES>
	): Promise<void>;

	getCurrentDatabaseIngot(
		dataSource: DataSourceInterface<DatabasesTypes.POSTGRES>,
		tableName: string,
		tableSchema: string
	): Promise<DatabaseIngotInterface<DatabasesTypes.POSTGRES>>;
}