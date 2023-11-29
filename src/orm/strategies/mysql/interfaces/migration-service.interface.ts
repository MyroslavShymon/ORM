import { DataSourceInterface } from '@core/interfaces';

export interface MigrationServiceInterface {
	createMigrationTable(): string;

	checkTableExistence(dataSource: DataSourceInterface, tableName: string, tableSchema?: string): Promise<boolean>;

}