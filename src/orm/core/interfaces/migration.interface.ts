import { DatabaseManagerInterface } from '@core/interfaces/database-manager.interface';
import { DatabasesTypes } from '@core/enums';

export interface MigrationInterface {
	up(databaseManager: DatabaseManagerInterface<DatabasesTypes>): Promise<string>;

	down(databaseManager: DatabaseManagerInterface<DatabasesTypes>): Promise<string>;
}