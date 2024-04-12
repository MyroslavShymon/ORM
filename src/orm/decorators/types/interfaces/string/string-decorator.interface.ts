import { MysqlStringTypesType, PostgresStringTypesType } from '@decorators/types/types';

export interface StringDecoratorInterface {
	type: PostgresStringTypesType | MysqlStringTypesType;
	length?: number;
}