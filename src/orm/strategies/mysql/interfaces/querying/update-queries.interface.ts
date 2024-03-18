export interface UpdateQueriesInterface {
	update(values: Partial<Object>, tableName: string): string;
}