import {
	CheckTableExistenceOptionsInterface,
	CreateMigrationTableOptionsInterface,
	DatabaseIngotInterface,
	GetCurrentDatabaseIngotOptionsInterface,
	InitCurrentDatabaseIngotOptionsInterface,
	SyncDatabaseIngotOptionsInterface
} from '@core/interfaces';
import { MigrationServiceInterface } from '@strategies/mysql';
import { constants } from '@core/constants';
import { DatabasesTypes } from '@core/enums';

export class MigrationService implements MigrationServiceInterface {
	createMigrationTable({ tableName, databaseName }: CreateMigrationTableOptionsInterface): string {
		return `
use ${databaseName}
CREATE TABLE IF NOT EXISTS ${databaseName}.${tableName}
        (
            id
            INT
            AUTO_INCREMENT
            PRIMARY
            KEY,
            name
            VARCHAR
                (
            256
                ),
            is_up BOOLEAN DEFAULT FALSE,
            ingot JSON NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );` + this._preventUpdateName(tableName);
	}

	private _preventUpdateName(tableName: string) {
		return `
		CREATE PROCEDURE IF NOT EXISTS prevent_name_update(IN old_name VARCHAR(255), IN new_name VARCHAR(255))
BEGIN
    DECLARE msg VARCHAR(255);
    IF old_name <> new_name THEN
        SET msg = CONCAT('Updating the "name" column is not allowed in the ', TABLE_SCHEMA, '.', TABLE_NAME, ' table.');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg;
    END IF;
END;
    CREATE TRIGGER IF NOT EXISTS prevent_name_update_trigger BEFORE UPDATE ON ${tableName} FOR EACH ROW
BEGIN
    CALL prevent_name_update(OLD.name, NEW.name);
END;
		`;
	}

	async checkTableExistence({
								  tableName,
								  dataSource
							  }: CheckTableExistenceOptionsInterface<DatabasesTypes.MYSQL>): Promise<boolean> {
		const checkTableExistenceQuery = `
            SELECT EXISTS (SELECT 1
                           FROM information_schema.tables
                           WHERE table_name = '${tableName}') AS table_existence;
		`;

		const tableExistence = await dataSource.client.query(checkTableExistenceQuery);

		return !!tableExistence[0][0].table_existence;
	}

	async initCurrentDatabaseIngot({
									   databaseIngot,
									   databaseName,
									   tableName,
									   dataSource
								   }: InitCurrentDatabaseIngotOptionsInterface<DatabasesTypes.MYSQL>): Promise<void> {
		const initCurrentDatabaseIngotQuery = `
            INSERT INTO ${databaseName}.${tableName} (name, ingot)
            VALUES ('${constants.currentDatabaseIngot}', '${JSON.stringify(databaseIngot)}');
		`;

		await dataSource.client.query(initCurrentDatabaseIngotQuery);
	}

	async syncDatabaseIngot({
								databaseName,
								tableName,
								databaseIngot,
								dataSource
							}: SyncDatabaseIngotOptionsInterface<DatabasesTypes.MYSQL>): Promise<void> {
		const syncDatabaseIngotQuery = `
            UPDATE ${databaseName}.${tableName}
            SET ingot = '${JSON.stringify(databaseIngot)}'
            WHERE name = '${constants.currentDatabaseIngot}';
		`;

		await dataSource.client.query(syncDatabaseIngotQuery);
	}

	async getCurrentDatabaseIngot({
									  databaseName,
									  tableName,
									  dataSource
								  }: GetCurrentDatabaseIngotOptionsInterface<DatabasesTypes.MYSQL>): Promise<DatabaseIngotInterface<DatabasesTypes.MYSQL>> {
		const getCurrentDatabaseIngotQuery = `SELECT ingot
                                              FROM ${databaseName}.${tableName}
                                              WHERE name = 'current_database_ingot'`;
		const ingot = await dataSource.client.query(getCurrentDatabaseIngotQuery);
		return ingot[0][0].ingot;
	}
}