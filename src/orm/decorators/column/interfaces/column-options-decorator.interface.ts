import { MysqlDataTypes, PostgresqlDataTypes } from '@core/types';
import { DatabasesTypes } from '@core/enums';

export interface ColumnOptionsDecoratorInterface<DT extends DatabasesTypes | undefined = undefined> {
	dataType?: PostgresqlDataTypes | MysqlDataTypes;
	nullable?: boolean;
	length?: number;
	check?: string;//only postgres
	nameOfCheckConstraint?: string;//only postgres
	defaultValue?: string | number | boolean;
	unique?: boolean;
	nullsNotDistinct?: boolean;//only postgres
	displayWidth?: number;//only mysql
	isUnsigned?: boolean;//only mysql
	isZerofill?: boolean;//only mysql
	isAutoIncrement?: boolean;//only mysql
}