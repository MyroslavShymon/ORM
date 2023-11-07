import { PostgresqlDataTypes } from '../../../enums';

export interface ComputedColumnInterface {
	name: string;
	dataType: PostgresqlDataTypes;
	calculate: string;
	stored: boolean;
}