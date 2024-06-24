import { MysqlDataTypes } from '@core/types';

export interface ColumnOptionsMysqlInterface {
	dataType?: MysqlDataTypes;
	nullable?: boolean;
	length?: number;
	check?: string;
	nameOfCheckConstraint?: string;
	defaultValue?: string | number | boolean;
	unique?: boolean;
	displayWidth?: number;
	isUnsigned?: boolean;
	isZerofill?: boolean;
	isAutoIncrement?: boolean;
	values?: string[];  // Додано параметр для типів ENUM і SET
	scale?: number;
	precision?: number;
}