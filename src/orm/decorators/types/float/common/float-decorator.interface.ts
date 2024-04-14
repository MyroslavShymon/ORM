import { MysqlFloatTypesType } from '@decorators/types/float/common/mysql-float-types.type';
import { PostgresFloatTypesType } from '@decorators/types/float/common/postgres-float-types.type';

export interface FloatDecoratorInterface {
	type: MysqlFloatTypesType | PostgresFloatTypesType;
	precision?: number;//postgres
	scale?: number;//postgres
	totalNumberOfDigits?: number;//mysql
	numberOfDigitsAfterPoint?: number;//mysql
	isUnsigned?: boolean;//mysql
	isZerofill?: boolean;//mysql
}