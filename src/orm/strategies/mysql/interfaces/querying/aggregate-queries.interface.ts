import { ConditionParamsType } from '@core/types';

export interface AggregateQueriesInterface {
	having(params: ConditionParamsType): string;
}