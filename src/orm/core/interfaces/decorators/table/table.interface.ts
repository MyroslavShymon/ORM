import { DatabasesTypes } from '@core/enums';
import { TableOptionsInterface } from '@core/interfaces';

export interface TableInterface<DT extends DatabasesTypes | undefined = undefined> {
	name: string;
	options?: TableOptionsInterface<DT>;
}