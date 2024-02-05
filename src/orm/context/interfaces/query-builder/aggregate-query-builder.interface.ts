export interface AggregateQueryBuilderInterface {
	summing(column: string): void;

	counting(column: string): void;

	having(condition: string): void;

	groupBy(columns: string[]): void;
}