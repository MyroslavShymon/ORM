import { ColumnOptionsInterface } from '@decorators/column';
import { DatabasesTypes } from '@core/enums';

export interface AddColumnInterface<DB extends DatabasesTypes | undefined = undefined> {
	columnName: string;
	options?: ColumnOptionsInterface<DB>;
}