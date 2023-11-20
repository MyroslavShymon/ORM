import { DataSourceMySql } from '../data-source-mysql';
import { AddColumnInterface } from '../../../core';

export interface TableAltererInterface {
	addColumn(tableName: string, parameters: AddColumnInterface<DataSourceMySql>): string;
}