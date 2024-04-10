import { DatabasesTypes } from '@core/enums';
import { TableOptionsMysqlInterface, TableOptionsPostgresqlInterface } from '@core/interfaces';

export interface TableInterface<DB extends DatabasesTypes | undefined = undefined> {
	name: string;
	options?: DB extends DatabasesTypes.POSTGRES ? TableOptionsPostgresqlInterface : TableOptionsMysqlInterface;
}