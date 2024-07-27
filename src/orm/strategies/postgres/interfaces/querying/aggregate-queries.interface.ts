import { ConditionParamsType } from '@core/types';

export interface AggregateQueriesInterface {
	having(params: ConditionParamsType): string;

	summing(column: string): string;

	counting(column: string): string;

	groupBy(columns: string[]): string;
}