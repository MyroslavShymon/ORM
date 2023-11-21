import { ColumnOptionsInterfacePostgres } from '@decorators/postgres';

export interface ColumnDecoratorInterface {
	name?: string;
	options?: ColumnOptionsInterfacePostgres;
}