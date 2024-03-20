import { DatabaseIngotInterface, DataSourceInterface } from '@core/interfaces';
import { MigrationServiceInterface } from '@strategies/mysql';
import { constants } from '@core/constants';

export class MigrationService implements MigrationServiceInterface {
	async getCurrentDatabaseIngot(
		dataSource: DataSourceInterface,
		tableName: string
	): Promise<DatabaseIngotInterface> {
		const getCurrentDatabaseIngotQuery = `SELECT ingot FROM ${tableName} WHERE name = 'current_database_ingot'`;
		const ingot = await dataSource.client.query(getCurrentDatabaseIngotQuery);
		return ingot;
	}

	createMigrationTable(tableName: string): string {
		return `CREATE TABLE ${tableName} (
					id INT AUTO_INCREMENT PRIMARY KEY,
					name VARCHAR(256),
					is_up BOOLEAN DEFAULT FALSE,
					ingot JSON NOT NULL,
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
				);` + '\n' + this.preventUpdateName(tableName);
	}

	preventUpdateName(tableName: string) {
		return `
			CREATE TRIGGER prevent_name_update_trigger
			BEFORE UPDATE ON '${tableName}'
			FOR EACH ROW
			BEGIN
			  IF NEW.name <> OLD.name THEN
				SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = 'Updating the "name" column is not allowed in the ${tableName} table.';
			  END IF;
			END;`;
	}


	async initCurrentDatabaseIngot(
		dataSource: DataSourceInterface,
		tableName: string,
		tableSchema: string,
		databaseIngot: DatabaseIngotInterface
	): Promise<void> {
		const initCurrentDatabaseIngotQuery = `
						INSERT INTO ${tableName} (name, ingot)
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
						UPDATE ${tableName}
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
							table_name = '${tableName}'
						) AS table_existence;
						`;

		const tableExistence = await dataSource.client.query(checkTableExistenceQuery);

		console.log('tableExistence', tableExistence);

		return !!tableExistence[0][0].table_existence;
	}
}