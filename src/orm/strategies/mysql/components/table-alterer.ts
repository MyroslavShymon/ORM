import { DataSourceMySql, TableAltererInterface } from '@strategies/mysql';
import { AddColumnInterface, DeleteColumnInterface } from '@core/interfaces';

//TODO переробити під mysql
export class TableAlterer implements TableAltererInterface {
	addColumn(tableName: string, parameters: AddColumnInterface<DataSourceMySql>): string {
		return `ALTER TABLE ${tableName} ADD COLUMN ${parameters.columnName} ${parameters.options.dataType};`;
	}

	deleteColumn(tableName: string, parameters: DeleteColumnInterface): string {
		return `ALTER TABLE ${tableName} DROP COLUMN ${parameters.columnName} ${parameters.isCascade ? 'CASCADE' : ''};`;
	}
}