import { PostgresqlDataTypes } from '../../../enums';

export interface ColumnOptionsInterface {
	dataType: PostgresqlDataTypes;
	nullable?: boolean;
	length?: number;
	check?: string;
	nameOfCheckConstraint?: string;
	defaultValue?: string | number;
	unique?: boolean;
	nullsNotDistinct?: boolean;
}