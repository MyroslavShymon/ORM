import { DatabasesTypes } from '@core/enums';
import { ColumnMysqlInterface, ColumnPostgresInterface } from '@core/interfaces';

export type ColumnInterface<DB extends DatabasesTypes | undefined = undefined> =
	DB extends DatabasesTypes.POSTGRES ? ColumnPostgresInterface : ColumnMysqlInterface;