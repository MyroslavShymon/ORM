import { ComputedColumnMysqlInterface, ComputedColumnPostgresInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';

export type ComputedColumnInterface<DB extends DatabasesTypes | undefined = undefined> =
	DB extends DatabasesTypes.POSTGRES ? ComputedColumnPostgresInterface : ComputedColumnMysqlInterface;