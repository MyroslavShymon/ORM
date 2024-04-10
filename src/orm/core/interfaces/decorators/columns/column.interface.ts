import { DatabasesTypes } from '@core/enums';
import { BaseColumnInterface, ColumnOptionsInterface } from '@core/interfaces';

export interface ColumnInterface<DB extends DatabasesTypes | undefined = undefined> extends BaseColumnInterface {
	options?: ColumnOptionsInterface<DB>;
}