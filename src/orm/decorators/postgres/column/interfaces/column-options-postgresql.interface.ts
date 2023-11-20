import { PostgresqlDataTypes } from '../../../../core';

export interface ColumnOptionsInterfacePostgres {
	dataType: PostgresqlDataTypes;
	nullable?: boolean;
	length?: number;
	check?: string;
	nameOfCheckConstraint?: string;
	defaultValue?: string | number;
	unique?: boolean;
	nullsNotDistinct?: boolean;
}