import { ColumnOptionsInterface } from '@decorators/column';
import { DatabasesTypes } from '@core/enums';

export interface ColumnMetadataInterface<DB extends DatabasesTypes | undefined = undefined> {
	name: string;
	propertyKey: string;
	options?: ColumnOptionsInterface<DB>;
}