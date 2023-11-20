import { TableOptionsPostgresqlInterface } from './table-options-postgresql.interface';

export interface TableDecoratorInterface {
	name?: string;
	options?: TableOptionsPostgresqlInterface;
}