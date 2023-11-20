import { PostgresqlDataTypes } from '../../../../core';

export interface ComputedColumnDecoratorInterface {
	name?: string;
	calculate: string;
	dataType: PostgresqlDataTypes;
	stored: boolean;
}