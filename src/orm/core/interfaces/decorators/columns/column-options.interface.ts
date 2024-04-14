import { DatabasesTypes } from '@core/enums';
import { ColumnOptionsMysqlInterface, ColumnOptionsPostgresInterface } from '@core/interfaces';

export type ColumnOptionsInterface<DB extends DatabasesTypes | undefined = undefined> =
	DB extends DatabasesTypes.POSTGRES ? ColumnOptionsPostgresInterface : ColumnOptionsMysqlInterface;