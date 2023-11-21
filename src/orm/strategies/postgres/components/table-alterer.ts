import { DataSourcePostgres, TableAltererInterface } from '@strategies/postgres';
import { AddColumnInterface } from '@core/interfaces';

export class TableAlterer implements TableAltererInterface {
	addColumn(tableName: string, parameters: AddColumnInterface<DataSourcePostgres>): string {
		return `ALTER TABLE ${tableName} ADD COLUMN ${parameters.columnName} ${parameters.options.dataType};`;
	}
}