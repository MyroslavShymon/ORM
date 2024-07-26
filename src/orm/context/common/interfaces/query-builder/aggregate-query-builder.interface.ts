import { ConditionParamsType } from '@core/types';

export interface AggregateQueryBuilderInterface {
	summing(column: string): void;

	counting(column: string): void;

	having(condition: ConditionParamsType): void;

	groupBy(columns: string[]): void;
}