export interface MigrationManagerInterface {
	createMigrationTable(): Promise<void>;

	checkTableExistence(tableName: string, tableSchema?: string): Promise<boolean>;

	insertIntoMigrationTable();

	updateMigrationTable();
}