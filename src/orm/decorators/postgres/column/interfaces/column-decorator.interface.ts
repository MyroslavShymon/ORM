import { ColumnOptionsInterfacePostgres } from './column-options-postgresql.interface';

export interface ColumnDecoratorInterface {
	name?: string;
	options?: ColumnOptionsInterfacePostgres;
}