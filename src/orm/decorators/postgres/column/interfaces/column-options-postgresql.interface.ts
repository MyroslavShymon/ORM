import { MysqlDataTypes, PostgresqlDataTypes } from '@core/enums';

export interface ColumnOptionsInterfacePostgres {
	dataType: PostgresqlDataTypes | MysqlDataTypes;
	nullable?: boolean;
	length?: number;
	check?: string;
	nameOfCheckConstraint?: string;
	defaultValue?: string | number | boolean;
	unique?: boolean;
	nullsNotDistinct?: boolean;
}