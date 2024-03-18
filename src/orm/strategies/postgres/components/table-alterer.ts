import { DataSourcePostgres, TableAltererInterface } from '@strategies/postgres';
import {
	AddColumnInterface,
	AddNotNullToColumnInterface,
	AddUniqueToColumnInterface,
	ChangeColumnDatatypeInterface,
	DeleteColumnInterface,
	DropNotNullFromColumnInterface
} from '@core/interfaces';

export class TableAlterer implements TableAltererInterface {
	addColumn(tableName: string, parameters: AddColumnInterface<DataSourcePostgres>): string {
		return `ALTER TABLE ${tableName} ADD COLUMN ${parameters.columnName} ${parameters.options.dataType};`;
	}

	deleteColumn(tableName: string, parameters: DeleteColumnInterface<DataSourcePostgres>): string {
		return `ALTER TABLE ${tableName} DROP COLUMN ${parameters.columnName} ${parameters.isCascade ? 'CASCADE' : ''};`;
	}

	addNotNullToColumn(tableName: string, parameters: AddNotNullToColumnInterface<DataSourcePostgres>): string {
		return `ALTER TABLE ${tableName} ALTER COLUMN ${parameters.columnName} SET NOT NULL;`;
	}

	dropNotNullFromColumn(tableName: string, parameters: DropNotNullFromColumnInterface<DataSourcePostgres>): string {
		return `ALTER TABLE ${tableName} ALTER COLUMN ${parameters.columnName} DROP NOT NULL;`;
	}

	addUniqueToColumn(tableName: string, parameters: AddUniqueToColumnInterface<DataSourcePostgres>): string {
		return `ALTER TABLE ${tableName} ADD CONSTRAINT ${parameters.constraintName} UNIQUE (${parameters.columnName});`;
	}

	changeDataTypeOfColumn(tableName: string, parameters: ChangeColumnDatatypeInterface): string {
		return `ALTER TABLE ${tableName} ALTER COLUMN ${parameters.columnName} TYPE ${parameters.datatype}(${parameters.typeParams});`;
	}
}