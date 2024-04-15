import { MysqlDataTypes, PostgresqlDataTypes } from '@core/types';
import { DatabasesTypes } from '@core/enums';

export interface ColumnOptionsDecoratorInterface<DT extends DatabasesTypes | undefined = undefined> {
	dataType?: PostgresqlDataTypes | MysqlDataTypes;
	nullable?: boolean;
	length?: number;
	defaultValue?: string | number | boolean;
	unique?: boolean;

	check?: string;//only postgres
	nameOfCheckConstraint?: string;//only postgres
	nullsNotDistinct?: boolean;//only postgres
	precision?: number;//only postgres
	scale?: number;//only postgres
	
	totalNumberOfDigits?: number;//only mysql
	numberOfDigitsAfterPoint?: number;//only mysql
	displayWidth?: number;//only mysql
	isUnsigned?: boolean;//only mysql
	isZerofill?: boolean;//only mysql
	isAutoIncrement?: boolean;//only mysql
}