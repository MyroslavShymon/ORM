import { MigrationServiceInterface } from '@strategies/postgres/interfaces/migration-service.interface';
import { DatabaseIngotInterface, DataSourceInterface } from '@core/interfaces';
import { constants } from '@core/constants';

export class MigrationService implements MigrationServiceInterface {
	async getCurrentDatabaseIngot(
		dataSource: DataSourceInterface,
		tableName: string,
		tableSchema: string
	): Promise<DatabaseIngotInterface> {
		const getCurrentDatabaseIngotQuery = `SELECT ingot FROM ${tableSchema}.${tableName} WHERE name = 'current_database_ingot'`;
		const ingot = await dataSource.client.query(getCurrentDatabaseIngotQuery);
		return ingot.rows[0].ingot;
	}

	createMigrationTable(tableName: string, tableSchema: string): string {
		return `CREATE TABLE ${tableSchema}.${tableName} (
				id SERIAL PRIMARY KEY,
				name VARCHAR(256),
				is_up BOOLEAN DEFAULT FALSE,
				ingot JSON NOT NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			);` + '\n' + this.preventUpdateName(tableName, tableSchema);
	}

	preventUpdateName(tableName: string, tableSchema: string) {
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
						
						CREATE TRIGGER prevent_name_update_trigger
						BEFORE UPDATE ON public.migrations
						FOR EACH ROW
						EXECUTE FUNCTION prevent_name_update();
						`;
	}

	async initCurrentDatabaseIngot(
		dataSource: DataSourceInterface,
		tableName: string,
		tableSchema: string,
		databaseIngot: DatabaseIngotInterface
	): Promise<void> {
		const initCurrentDatabaseIngotQuery = `
						INSERT INTO ${tableSchema}.${tableName} (name, ingot)
					  	VALUES 
					    	('${constants.currentDatabaseIngot}', '${JSON.stringify(databaseIngot)}');
						`;

		await dataSource.client.query(initCurrentDatabaseIngotQuery);
	}

	async syncDatabaseIngot(
		dataSource: DataSourceInterface,
		tableName: string,
		tableSchema: string,
		databaseIngot: DatabaseIngotInterface
	): Promise<void> {
		const syncDatabaseIngotQuery = `
						UPDATE ${tableSchema}.${tableName}
						SET ingot = '${JSON.stringify(databaseIngot)}'
						WHERE name = '${constants.currentDatabaseIngot}';
						`;

		await dataSource.client.query(syncDatabaseIngotQuery);
	}

	async checkTableExistence(dataSource: DataSourceInterface, tableName: string, tableSchema?: string): Promise<boolean> {
		const checkTableExistenceQuery = `SELECT EXISTS (
							SELECT 1
							FROM information_schema.tables
							WHERE
							${tableSchema ? `table_schema = '${tableSchema}' AND` : ''}
							table_name = '${tableName}'
						) AS table_existence;
						`;

		const tableExistence = await dataSource.client.query(checkTableExistenceQuery);

		return tableExistence.rows[0].table_existence;
	}

}