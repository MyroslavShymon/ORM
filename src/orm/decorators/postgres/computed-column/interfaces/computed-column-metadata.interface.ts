import { PostgresqlDataTypes } from '@core/enums';

export interface ComputedColumnMetadataInterface {
	name: string;
	dataType: PostgresqlDataTypes;
	propertyKey: string;
	calculate: string;
	stored: boolean;
}