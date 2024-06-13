import { TableOptionsMysqlInterface, TableOptionsPostgresqlInterface } from '@core/interfaces';

export interface TableDecoratorInterface {
	name: string;
	options?: TableOptionsPostgresqlInterface | TableOptionsMysqlInterface;
}