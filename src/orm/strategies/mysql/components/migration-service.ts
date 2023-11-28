import { MigrationServiceInterface } from '@strategies/postgres/interfaces/migration-service.interface';

export class MigrationService implements MigrationServiceInterface {
	createMigrationTable(): string {
		return `CREATE TABLE migrations (
					id INT AUTO_INCREMENT PRIMARY KEY,
					ingot JSON,
					up BOOLEAN,
					down BOOLEAN,
					name VARCHAR(128),
					last_state_ingot JSON
				);`;
	}

	checkTableExistence(tableName: string, tableSchema?: string): string {
		return `SELECT EXISTS (
					SELECT 1
					FROM information_schema.tables
					WHERE
					${tableSchema ? `table_schema = '${tableSchema}' AND` : ''}
					table_name = '${tableName}'
				) AS table_existence;`;
	}
}