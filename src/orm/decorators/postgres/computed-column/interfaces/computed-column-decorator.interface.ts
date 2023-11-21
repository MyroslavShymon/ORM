import { PostgresqlDataTypes } from '@core/enums';

export interface ComputedColumnDecoratorInterface {
	name?: string;
	calculate: string;
	dataType: PostgresqlDataTypes;
	stored: boolean;
}