import { ConditionParamsType } from '@core/types';

export interface SelectQueriesInterface {
	where(params: ConditionParamsType): string;
}