import { MysqlDataTypes } from '@core/enums';

export interface ColumnOptionsInterfaceMysql {
	dataType: MysqlDataTypes;
	nullable?: boolean;
	length?: number;
	check?: string;
	defaultValue?: string | number;
	unique?: boolean;
}