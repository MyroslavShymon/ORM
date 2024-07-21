import {
	CheckTableExistenceOptionsInterface,
	CreateMigrationTableOptionsInterface,
	CreatePreventUpdateNameSubroutineOptionsInterface,
	CreatePreventUpdateNameTriggerOptions,
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

	createPreventUpdateNameSubroutine(options: CreatePreventUpdateNameSubroutineOptionsInterface): string;

	createPreventUpdateNameTrigger(options: CreatePreventUpdateNameTriggerOptions): string;
}