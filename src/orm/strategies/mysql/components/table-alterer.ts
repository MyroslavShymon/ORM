import { TableAltererInterface } from '../interfaces';
import { AddColumnInterface } from '../../../core';
import { DataSourceMySql } from '../data-source-mysql';

export class TableAlterer implements TableAltererInterface {
	addColumn(tableName: string, parameters: AddColumnInterface<DataSourceMySql>): string {
		return `ALTER TABLE ${tableName} ADD COLUMN ${parameters.columnName} ${parameters.options.dataType};`;
	}
}