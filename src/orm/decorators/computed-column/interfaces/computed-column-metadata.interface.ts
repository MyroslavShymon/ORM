import { PostgresqlDataTypes } from '@core/types';

export interface ComputedColumnMetadataInterface {
	name: string;
	dataType: PostgresqlDataTypes;
	propertyKey: string;
	calculate: string;
	stored: boolean;
}