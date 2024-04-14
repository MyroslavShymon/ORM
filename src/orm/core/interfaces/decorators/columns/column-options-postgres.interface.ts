import { PostgresqlDataTypes } from '@core/types';

export interface ColumnOptionsPostgresInterface {
	dataType?: PostgresqlDataTypes;
	nullable?: boolean;
	length?: number;
	check?: string;
	nameOfCheckConstraint?: string;
	defaultValue?: string | number | boolean;
	unique?: boolean;
	nullsNotDistinct?: boolean;
}