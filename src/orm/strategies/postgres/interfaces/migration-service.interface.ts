export interface MigrationServiceInterface {
	createMigrationTable(): string;

	checkTableExistence(tableName: string, tableSchema?: string): string;
}