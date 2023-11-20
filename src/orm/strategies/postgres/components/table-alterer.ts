import { DataSourcePostgres } from '../data-source-postgres';
import { AddColumnInterface } from '../../../core';
import { TableAltererInterface } from '../interfaces';

export class TableAlterer implements TableAltererInterface {
	addColumn(tableName: string, parameters: AddColumnInterface<DataSourcePostgres>): string {
		return `ALTER TABLE ${tableName} ADD COLUMN ${parameters.columnName} ${parameters.options.dataType};`;
	}
}