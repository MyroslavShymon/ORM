export interface BaseAggregateQueriesInterface {
	summing(column: string): string;

	counting(column: string): string;

	groupBy(columns: string[]): string;
}