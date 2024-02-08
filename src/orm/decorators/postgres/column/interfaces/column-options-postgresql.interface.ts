import { PostgresqlDataTypes } from '@core/enums';

export interface ColumnOptionsInterfacePostgres {
	dataType: PostgresqlDataTypes;
	nullable?: boolean;
	length?: number;
	check?: string;
	nameOfCheckConstraint?: string;
	defaultValue?: string | number | boolean;
	unique?: boolean;
	nullsNotDistinct?: boolean;
}