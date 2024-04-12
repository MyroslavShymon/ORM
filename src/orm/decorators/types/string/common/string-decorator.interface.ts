import { MysqlStringTypesType, PostgresStringTypesType } from '@decorators/types';

export interface StringDecoratorInterface {
	type: PostgresStringTypesType | MysqlStringTypesType;
	length?: number;
}