import { MigrationServiceInterface } from '@strategies/postgres/interfaces/migration-service.interface';
import { DataSourceInterface } from '@core/interfaces';

export class MigrationService implements MigrationServiceInterface {
	createMigrationTable(): string {
		return `CREATE TABLE migrations (
				id SERIAL PRIMARY KEY,
				ingot JSON,
				up BOOLEAN,
				down BOOLEAN,
				name VARCHAR(128),
				last_state_ingot JSON
			);`;
	}

	async checkTableExistence(dataSource: DataSourceInterface, tableName: string, tableSchema?: string): Promise<boolean> {
		const checkTableExistenceQuery = `SELECT EXISTS (
					SELECT 1
					FROM information_schema.tables
					WHERE
					${tableSchema ? `table_schema = '${tableSchema}' AND` : ''}
					table_name = '${tableName}'
				) AS table_existence;`;

		const tableExistence = await dataSource.client.query(checkTableExistenceQuery);

		return tableExistence.rows[0].table_existence;
	}

}