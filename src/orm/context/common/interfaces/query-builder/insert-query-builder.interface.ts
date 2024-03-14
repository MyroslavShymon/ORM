export interface InsertQueryBuilderInterface<T> {
	setInto(name: string): void;

	insert(values: Partial<T>, tableName: string): void;

	insertMany(values: Partial<T>[], tableName: string): void;
}