export interface BaseAggregateQueriesInterface {
	summing(column: string): string;

	counting(column: string): string;

	having(condition: string): string;

	groupBy(columns: string[]): string;
}