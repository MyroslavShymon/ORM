import { DataSourceMySql, TableAltererInterface } from '@strategies/mysql';
import { AddColumnInterface } from '@core/interfaces';

export class TableAlterer implements TableAltererInterface {
	addColumn(tableName: string, parameters: AddColumnInterface<DataSourceMySql>): string {
		return `ALTER TABLE ${tableName} ADD COLUMN ${parameters.columnName} ${parameters.options.dataType};`;
	}
}