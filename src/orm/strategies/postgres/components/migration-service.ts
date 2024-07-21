import { MigrationServiceInterface } from '@strategies/postgres/interfaces/migration-service.interface';
import {
	CheckTableExistenceOptionsInterface,
	CreateMigrationTableOptionsInterface,
	CreatePreventUpdateNameSubroutineOptionsInterface,
	DatabaseIngotInterface,
	GetCurrentDatabaseIngotOptionsInterface,
	InitCurrentDatabaseIngotOptionsInterface,
	SyncDatabaseIngotOptionsInterface
} from '@core/interfaces';
import { constants } from '@core/constants';
import { DatabasesTypes } from '@core/enums';

export class MigrationService implements MigrationServiceInterface {
	createMigrationTable({ tableName, tableSchema }: CreateMigrationTableOptionsInterface): string {
		if (!tableSchema) {
			throw new Error('Не вказано ім\'я схеми');
		}

		return `CREATE TABLE ${tableSchema}.${tableName}
                (
                    id         SERIAL PRIMARY KEY,
                    name       VARCHAR(256),
                    is_up      BOOLEAN   DEFAULT FALSE,
                    ingot      JSON NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );`;
	}

	createPreventUpdateNameSubroutine({ tableName, tableSchema }: CreatePreventUpdateNameSubroutineOptionsInterface) {
		if (!tableName && !tableSchema) {
			throw new Error('Не вказано ім\'я таблиці або схема');
		}

		return `
						CREATE OR REPLACE FUNCTION prevent_name_update()
						RETURNS TRIGGER AS $$
						BEGIN
						  IF NEW.name <> OLD.name AND TG_TABLE_NAME = '${tableName}' AND TG_TABLE_SCHEMA = '${tableSchema}' THEN
							RAISE EXCEPTION 'Updating the "name" column is not allowed in the ${tableSchema}.${tableName} table.';
						  END IF;
						  RETURN NEW;
						END;
						$$ LANGUAGE plpgsql;
						`;
	}

	createPreventUpdateNameTrigger() {
		return `
						CREATE TRIGGER prevent_name_update_trigger
						BEFORE UPDATE ON public.migrations
						FOR EACH ROW
						EXECUTE FUNCTION prevent_name_update();
						`;
	}

	async checkTableExistence({
								  tableName,
								  tableSchema,
								  dataSource
							  }: CheckTableExistenceOptionsInterface<DatabasesTypes.POSTGRES>): Promise<boolean> {
		const checkTableExistenceQuery = `SELECT EXISTS (SELECT 1
                                                         FROM information_schema.tables
                                                         WHERE ${tableSchema ? `table_schema = '${tableSchema}' AND` : ''}
            table_name = '${tableName}') AS table_existence;
		`;

		const tableExistence = await dataSource.client.query(checkTableExistenceQuery);

		return tableExistence.rows[0].table_existence;
	}

	async initCurrentDatabaseIngot(
		{
			tableName,
			tableSchema,
			databaseIngot,
			dataSource
		}: InitCurrentDatabaseIngotOptionsInterface<DatabasesTypes.POSTGRES>
	): Promise<void> {
		if (!tableSchema) {
			throw new Error('Не вказано ім\'я схеми');
		}

		const initCurrentDatabaseIngotQuery = `
            INSERT INTO ${tableSchema}.${tableName} (name, ingot)
            VALUES ('${constants.currentDatabaseIngot}', '${JSON.stringify(databaseIngot)}');
		`;

		await dataSource.client.query(initCurrentDatabaseIngotQuery);
	}

	async syncDatabaseIngot(
		{
			databaseIngot,
			tableName,
			tableSchema,
			dataSource
		}: SyncDatabaseIngotOptionsInterface<DatabasesTypes.POSTGRES>
	): Promise<void> {
		if (!tableSchema) {
			throw new Error('Не вказано ім\'я схеми');
		}

		const syncDatabaseIngotQuery = `
            UPDATE ${tableSchema}.${tableName}
            SET ingot = '${JSON.stringify(databaseIngot)}'
            WHERE name = '${constants.currentDatabaseIngot}';
		`;

		await dataSource.client.query(syncDatabaseIngotQuery);
	}

	async getCurrentDatabaseIngot(
		{
			tableName,
			dataSource,
			tableSchema
		}: GetCurrentDatabaseIngotOptionsInterface<DatabasesTypes.POSTGRES>): Promise<DatabaseIngotInterface<DatabasesTypes.POSTGRES>> {
		if (!tableSchema) {
			throw new Error('Не вказано ім\'я схеми');
		}

		const getCurrentDatabaseIngotQuery = `SELECT ingot
                                              FROM ${tableSchema}.${tableName}
                                              WHERE name = 'current_database_ingot'`;
		const ingot = await dataSource.client.query(getCurrentDatabaseIngotQuery);
		return ingot.rows[0].ingot;
	}
}