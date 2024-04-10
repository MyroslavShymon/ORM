import { TableOptionsMysqlInterface, TableOptionsPostgresqlInterface } from '@decorators/index';
import { DatabasesTypes } from '@core/enums';

export interface TableInterface<DB extends DatabasesTypes | undefined = undefined> {
	name: string;
	options?: DB extends DatabasesTypes.POSTGRES ? TableOptionsPostgresqlInterface : TableOptionsMysqlInterface;
}