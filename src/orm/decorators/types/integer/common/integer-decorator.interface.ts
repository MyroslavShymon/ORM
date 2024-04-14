import { MysqlIntegerTypesType, PostgresIntegerTypesType } from '@decorators/types';

export interface IntegerDecoratorInterface {
	type: MysqlIntegerTypesType | PostgresIntegerTypesType;
	displayWidth?: number;//only mysql
	isUnsigned?: boolean;//only mysql
	isZerofill?: boolean;//only mysql
	isAutoIncrement?: boolean;//only mysql
}