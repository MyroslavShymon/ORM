import { ColumnOptionsInterface } from './column-options.interface';
import { DatabasesTypes } from '@core/enums';

export interface ColumnDecoratorInterface<DB extends DatabasesTypes | undefined = undefined> {
	name?: string;
	options?: ColumnOptionsInterface<DB>;
}