import {
	CheckTableExistenceOptionsInterface,
	CreateMigrationTableOptionsInterface,
	InitIngotOptionsInterface,
	SyncDatabaseIngotInterface
} from '@context/common';

export interface MigrationManagerInterface {
	createMigrationTable(options?: CreateMigrationTableOptionsInterface): Promise<void>;

	checkTableExistence(options?: CheckTableExistenceOptionsInterface): Promise<boolean>;

	initCurrentDatabaseIngot(options: InitIngotOptionsInterface): Promise<void>;

	syncDatabaseIngot(options: SyncDatabaseIngotInterface): Promise<void>;
}