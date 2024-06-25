import { DatabasesTypes } from '@core/enums';
import { ColumnOptionsInterface } from '@core/interfaces';

export interface AddColumnInterface<DT extends DatabasesTypes> {
	columnName: string;
	options?: ColumnOptionsInterface<DT>;
}