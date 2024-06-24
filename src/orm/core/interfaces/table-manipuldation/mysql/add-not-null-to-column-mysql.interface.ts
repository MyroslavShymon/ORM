import { MysqlDataTypes } from '@core/types';

export interface AddNotNullToColumnMysqlInterface {
	columnName: string;
	columnType?: MysqlDataTypes;
	typeLength?: number;
}