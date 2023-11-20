import { MysqlDataTypes } from '../../../../core';

export interface ColumnOptionsInterfaceMysql {
	dataType: MysqlDataTypes;
	nullable?: boolean;
	length?: number;
	check?: string;
	defaultValue?: string | number;
	unique?: boolean;
}