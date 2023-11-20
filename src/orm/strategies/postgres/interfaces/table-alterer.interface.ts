import { DataSourcePostgres } from '../data-source-postgres';
import { AddColumnInterface } from '../../../core';

export interface TableAltererInterface {
	addColumn(tableName: string, parameters: AddColumnInterface<DataSourcePostgres>): string;
}