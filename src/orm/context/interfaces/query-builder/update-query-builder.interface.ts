export interface UpdateQueryBuilderInterface<T> {
	update(values: Partial<T>, tableName: string): void;
}