import { ComputedColumnMysqlInterface, ComputedColumnPostgresInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';

export type ComputedColumnInterface<DT extends DatabasesTypes | undefined = undefined> =
	DT extends DatabasesTypes.POSTGRES ? ComputedColumnPostgresInterface : ComputedColumnMysqlInterface;