import { DataSourceMySql, TableAltererInterface } from '@strategies/mysql';
import {
	AddColumnInterface,
	AddNotNullToColumnInterface,
	AddUniqueToColumnInterface,
	ChangeColumnDatatypeInterface,
	DeleteColumnInterface,
	DropNotNullFromColumnInterface
} from '@core/interfaces';

export class TableAlterer implements TableAltererInterface {
	addColumn(tableName: string, parameters: AddColumnInterface<DataSourceMySql>): string {
		return `ALTER TABLE '${tableName}' ADD '${parameters.columnName}' ${parameters.options.dataType};`;
	}

	deleteColumn(tableName: string, parameters: DeleteColumnInterface<DataSourceMySql>): string {
		return `ALTER TABLE '${tableName}' DROP COLUMN '${parameters}';`;
	}

	addNotNullToColumn(tableName: string, parameters: AddNotNullToColumnInterface<DataSourceMySql>): string {
		if (!parameters.columnType) {
			throw new Error(`There is no datatype of column`);
		}
		return `ALTER TABLE ${tableName} MODIFY COLUMN ${parameters.columnName} ${parameters.columnType}${parameters.typeLength ? `(${parameters.typeLength})` : ''} NOT NULL;`;
	}

	dropNotNullFromColumn(tableName: string, parameters: DropNotNullFromColumnInterface<DataSourceMySql>): string {
		if (!parameters.columnType) {
			throw new Error(`There is no datatype of column`);
		}
		return `ALTER TABLE ${tableName} MODIFY COLUMN ${parameters.columnName} ${parameters.columnType}${parameters.typeLength ? `(${parameters.typeLength})` : ''} NULL;`;
	}

	addUniqueToColumn(tableName: string, parameters: AddUniqueToColumnInterface<DataSourceMySql>): string {
		return `ALTER TABLE ${tableName} ADD UNIQUE (${parameters.columnName});`;
	}

	changeDataTypeOfColumn(tableName: string, parameters: ChangeColumnDatatypeInterface): string {
		return `ALTER TABLE ${tableName} MODIFY COLUMN ${parameters.columnName} ${parameters.datatype};`;
	}
}