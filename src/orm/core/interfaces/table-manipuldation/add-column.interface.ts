import { DatabasesTypes } from '@core/enums';
import { ColumnOptionsInterface } from '@core/interfaces';

export interface AddColumnInterface<DB extends DatabasesTypes | undefined = undefined> {
	columnName: string;
	options?: ColumnOptionsInterface<DB>;
}