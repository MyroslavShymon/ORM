import { DatabasesTypes } from '@core/enums';
import {
	CheckTableExistenceManagersOptionsInterface,
	CreateMigrationTableManagersOptionsInterface,
	InitDatabaseIngotManagersOptionsInterface,
	SyncIngotManagersOptionsInterface
} from '@context/common';

export interface MigrationManagerInterface<DT extends DatabasesTypes> {
	createMigrationTable(options?: CreateMigrationTableManagersOptionsInterface): Promise<void>;

	checkTableExistence(options?: CheckTableExistenceManagersOptionsInterface): Promise<boolean>;

	initCurrentDatabaseIngot(options: InitDatabaseIngotManagersOptionsInterface<DT>): Promise<void>;

	syncDatabaseIngot(options: SyncIngotManagersOptionsInterface<DT>): Promise<void>;
}