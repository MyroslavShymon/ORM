import { DataSourceMySql } from '@strategies/mysql';
import { MysqlDataTypes } from '@core/types';

export interface DropNotNullFromColumnInterface<DB> {
	columnName: string;
	columnType?: DB extends DataSourceMySql ? MysqlDataTypes : never;
	typeLength?: DB extends DataSourceMySql ? number : never;
}