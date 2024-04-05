import { ColumnOptionsInterface } from '@decorators/column';
import { DatabasesTypes } from '@core/enums';

export interface ColumnInterface<DB extends DatabasesTypes | undefined = undefined> {
	id?: string;
	name: string;
	options?: ColumnOptionsInterface<DB>;
}