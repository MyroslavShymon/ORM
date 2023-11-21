import { AddColumnInterface } from '@core/interfaces';
import { DataSourceMySql } from '@strategies/mysql';

export interface TableAltererInterface {
	addColumn(tableName: string, parameters: AddColumnInterface<DataSourceMySql>): string;
}