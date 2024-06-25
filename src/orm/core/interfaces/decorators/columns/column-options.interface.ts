import { DatabasesTypes } from '@core/enums';
import { ColumnOptionsMysqlInterface, ColumnOptionsPostgresInterface } from '@core/interfaces';

export type ColumnOptionsInterface<DT extends DatabasesTypes> =
	DT extends DatabasesTypes.POSTGRES ? ColumnOptionsPostgresInterface : ColumnOptionsMysqlInterface;