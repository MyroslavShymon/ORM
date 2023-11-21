import { TableOptionsPostgresqlInterface } from '@decorators/postgres';

export interface TableDecoratorInterface {
	name?: string;
	options?: TableOptionsPostgresqlInterface;
}