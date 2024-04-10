import { TableOptionsMysqlInterface, TableOptionsPostgresqlInterface } from '@decorators/index';

export interface TableDecoratorInterface {
	name?: string;
	options?: TableOptionsPostgresqlInterface | TableOptionsMysqlInterface;
}