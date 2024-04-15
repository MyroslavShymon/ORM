import {
	MysqlFloatTypesType,
	MysqlIntegerTypesType,
	PostgresFloatTypesType,
	PostgresIntegerTypesType
} from '@decorators/types';

export interface NumericDecoratorInterface {
	type: MysqlIntegerTypesType | PostgresIntegerTypesType | MysqlFloatTypesType | PostgresFloatTypesType;
	precision?: number;//only postgres
	scale?: number;//only postgres
	totalNumberOfDigits?: number;//only mysql
	numberOfDigitsAfterPoint?: number;//only mysql
	displayWidth?: number;//only mysql
	isUnsigned?: boolean;//only mysql
	isZerofill?: boolean;//only mysql
	isAutoIncrement?: boolean;//only mysql
}