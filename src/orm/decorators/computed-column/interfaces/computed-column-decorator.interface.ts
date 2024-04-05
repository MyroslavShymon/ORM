import { PostgresqlDataTypes } from '@core/types';

export interface ComputedColumnDecoratorInterface {
	name?: string;
	calculate: string;
	dataType: PostgresqlDataTypes;
	stored: boolean;
}