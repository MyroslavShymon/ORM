import {
	CheckTableExistenceOptionsInterface,
	CreateMigrationTableOptionsInterface,
	InitIngotOptionsInterface,
	SyncDatabaseIngotInterface
} from '@context/common';
import { DatabasesTypes } from '@core/enums';

export interface MigrationManagerInterface<DT extends DatabasesTypes> {
	createMigrationTable(options?: CreateMigrationTableOptionsInterface): Promise<void>;

	checkTableExistence(options?: CheckTableExistenceOptionsInterface): Promise<boolean>;

	initCurrentDatabaseIngot(options: InitIngotOptionsInterface<DT>): Promise<void>;

	syncDatabaseIngot(options: SyncDatabaseIngotInterface<DT>): Promise<void>;
}