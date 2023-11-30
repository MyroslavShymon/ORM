import {
	CheckTableExistenceOptionsInterface,
	CreateMigrationTableOptionsInterface,
	InitIngotOptionsInterface,
	SyncDatabaseIngotInterface
} from '@context/interfaces';

export interface MigrationManagerInterface {
	createMigrationTable(options?: CreateMigrationTableOptionsInterface): Promise<void>;

	checkTableExistence(options?: CheckTableExistenceOptionsInterface): Promise<boolean>;

	initCurrentDatabaseIngot(options: InitIngotOptionsInterface): Promise<void>;

	syncDatabaseIngot(options: SyncDatabaseIngotInterface): Promise<void>;
}