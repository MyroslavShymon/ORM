import { TableAltererInterface } from '../interfaces/table-alterer.interface';
import { AddColumnInterface } from '../../../../interfaces';

export class TableAlterer implements TableAltererInterface {
	addColumn(tableName: string, parameters: AddColumnInterface): string {
		return `ALTER TABLE ${tableName} ADD COLUMN ${parameters.columnName} ${parameters.options.dataType};`;
	}
}