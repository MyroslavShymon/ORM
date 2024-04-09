import { MysqlDataTypes, PostgresqlDataTypes } from '@core/types';
import { DatabasesTypes } from '@core/enums';

export interface ColumnOptionsDecoratorInterface<DT extends DatabasesTypes | undefined = undefined> {
	dataType: PostgresqlDataTypes | MysqlDataTypes;
	nullable?: boolean;
	length?: number;
	check?: string;
	nameOfCheckConstraint?: string;
	defaultValue?: string | number | boolean;
	unique?: boolean;
	nullsNotDistinct?: boolean;
}