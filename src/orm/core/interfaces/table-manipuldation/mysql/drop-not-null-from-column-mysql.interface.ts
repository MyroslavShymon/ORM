import { MysqlDataTypes } from '@core/types';

export interface DropNotNullFromColumnMysqlInterface {
	columnName: string;
	columnType?: MysqlDataTypes;
	typeLength?: number;
}