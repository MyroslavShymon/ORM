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

	checkTableExistence(options: CheckTableExistenceOptionsInterface<DatabasesTypes.POSTGRES>): Promise<boolean>;

	initCurrentDatabaseIngot(options: InitCurrentDatabaseIngotOptionsInterface<DatabasesTypes.POSTGRES>): Promise<void>;

	syncDatabaseIngot(options: SyncDatabaseIngotOptionsInterface<DatabasesTypes.POSTGRES>): Promise<void>;

	getCurrentDatabaseIngot(options: GetCurrentDatabaseIngotOptionsInterface<DatabasesTypes.POSTGRES>): Promise<DatabaseIngotInterface<DatabasesTypes.POSTGRES>>;

}