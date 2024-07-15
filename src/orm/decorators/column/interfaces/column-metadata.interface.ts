import { ColumnOptionsDecoratorInterface } from './column-options-decorator.interface';
import { DatabasesTypes } from '@core/enums';

export interface ColumnMetadataInterface<DT extends DatabasesTypes | undefined = undefined> {
	name: string;
	propertyKey: string;
	options?: ColumnOptionsDecoratorInterface<DT>;
}