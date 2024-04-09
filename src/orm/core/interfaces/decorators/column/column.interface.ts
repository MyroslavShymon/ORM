import { DatabasesTypes } from '@core/enums';
import { ColumnOptionsInterface } from '@core/interfaces';

export interface ColumnInterface<DB extends DatabasesTypes | undefined = undefined> {
	id?: string;
	name: string;
	options?: ColumnOptionsInterface<DB>;
}