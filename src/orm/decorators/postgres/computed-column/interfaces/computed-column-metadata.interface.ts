import { PostgresqlDataTypes } from '../../../../core';

export interface ComputedColumnMetadataInterface {
	name: string;
	dataType: PostgresqlDataTypes;
	propertyKey: string;
	calculate: string;
	stored: boolean;
}