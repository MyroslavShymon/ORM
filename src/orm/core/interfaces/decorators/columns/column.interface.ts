import { DatabasesTypes } from '@core/enums';
import { ColumnMysqlInterface, ColumnPostgresInterface } from '@core/interfaces';

export type ColumnInterface<DT extends DatabasesTypes | undefined = undefined> =
	DT extends DatabasesTypes.POSTGRES ? ColumnPostgresInterface : ColumnMysqlInterface;