import {
	CheckTableExistenceOptionsInterface,
	CreateMigrationTableOptionsInterface,
	DatabaseIngotInterface,
	GetCurrentDatabaseIngotOptionsInterface,
	InitCurrentDatabaseIngotOptionsInterface,
	SyncDatabaseIngotOptionsInterface
} from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';

export interface MigrationServiceInterface {
	createMigrationTable(options: CreateMigrationTableOptionsInterface): string;

	checkTableExistence(options: CheckTableExistenceOptionsInterface<DatabasesTypes.MYSQL>): Promise<boolean>;

	initCurrentDatabaseIngot(options: InitCurrentDatabaseIngotOptionsInterface<DatabasesTypes.MYSQL>): Promise<void>;

	syncDatabaseIngot(options: SyncDatabaseIngotOptionsInterface<DatabasesTypes.MYSQL>): Promise<void>;

	getCurrentDatabaseIngot(options: GetCurrentDatabaseIngotOptionsInterface<DatabasesTypes.MYSQL>): Promise<DatabaseIngotInterface<DatabasesTypes.MYSQL>>;
}