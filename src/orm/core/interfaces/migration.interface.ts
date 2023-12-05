import { DatabaseManagerInterface } from '@core/interfaces/database-manager.interface';

export interface MigrationInterface {
	up(databaseManager: DatabaseManagerInterface): Promise<void>;

	down(databaseManager: DatabaseManagerInterface): Promise<void>;
}