import { DatabasesTypes } from '@core/enums';
import { ComputedColumnMysqlInterface, ComputedColumnPostgresInterface } from '@core/interfaces';

export type AddComputedColumnInterface<DB extends DatabasesTypes | undefined = undefined> =
	DB extends DatabasesTypes.POSTGRES ? ComputedColumnPostgresInterface : ComputedColumnMysqlInterface;