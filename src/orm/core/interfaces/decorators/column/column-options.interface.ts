import { DatabasesTypes } from '@core/enums';
import { DatabaseTypesMap } from '@core/types';

export interface ColumnOptionsInterface<DB extends DatabasesTypes | undefined = undefined> {
	dataType: DatabaseTypesMap<DB>;
	nullable?: boolean;
	length?: number;
	check?: string;
	nameOfCheckConstraint?: string;
	defaultValue?: string | number | boolean;
	unique?: boolean;
	nullsNotDistinct?: boolean;
}