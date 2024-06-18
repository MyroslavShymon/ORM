import { MysqlDataTypes } from '@core/types';

export interface ColumnOptionsMysqlInterface {
	dataType?: MysqlDataTypes;
	nullable?: boolean;
	check?: string;
	nameOfCheckConstraint?: string;
	length?: number;
	defaultValue?: string | number | boolean;
	unique?: boolean;
	displayWidth?: number;
	isUnsigned?: boolean;
	isZerofill?: boolean;
	isAutoIncrement?: boolean;
}