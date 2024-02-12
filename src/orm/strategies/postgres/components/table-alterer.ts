import { DataSourcePostgres, TableAltererInterface } from '@strategies/postgres';
import {
	AddColumnInterface,
	AddDefaultValueInterface,
	AddNotNullToColumnInterface,
	AddUniqueToColumnInterface,
	ChangeColumnDatatypeInterface,
	DeleteColumnInterface,
	DropDefaultValueInterface,
	DropNotNullFromColumnInterface,
	DropTableInterface,
	RenameColumnInterface,
	RenameTableInterface
} from '@core/interfaces';

export class TableAlterer implements TableAltererInterface {
	addColumn(tableName: string, parameters: AddColumnInterface<DataSourcePostgres>): string {
		return `ALTER TABLE public.${tableName} ADD COLUMN ${parameters.columnName} ${parameters.options.dataType};`;
	}

	deleteColumn(tableName: string, parameters: DeleteColumnInterface): string {
		return `ALTER TABLE public.${tableName} DROP COLUMN ${parameters.columnName} ${parameters.isCascade ? 'CASCADE' : ''};`;
	}

	addDefaultValue(tableName: string, parameters: AddDefaultValueInterface): string {
		return `ALTER TABLE public.${tableName} ALTER COLUMN ${parameters.columnName} SET DEFAULT '${parameters.value}';`;
	}

	dropDefaultValue(tableName: string, parameters: DropDefaultValueInterface): string {
		return `ALTER TABLE public.${tableName} ALTER COLUMN ${parameters.columnName} DROP DEFAULT;`;
	}

	addNotNullToColumn(tableName: string, parameters: AddNotNullToColumnInterface): string {
		return `ALTER TABLE public.${tableName} ALTER COLUMN ${parameters.columnName} SET NOT NULL;`;
	}

	dropNotNullFromColumn(tableName: string, parameters: DropNotNullFromColumnInterface): string {
		return `ALTER TABLE public.${tableName} ALTER COLUMN ${parameters.columnName} DROP NOT NULL;`;
	}

	addUniqueToColumn(tableName: string, parameters: AddUniqueToColumnInterface): string {
		return `ALTER TABLE public.${tableName} ADD CONSTRAINT ${parameters.constraintName} UNIQUE (${parameters.columnName});`;
	}

	changeDataTypeOfColumn(tableName: string, parameters: ChangeColumnDatatypeInterface): string {
		return `ALTER TABLE public.${tableName} ALTER COLUMN ${parameters.columnName} TYPE ${parameters.datatype}(${parameters.typeParams});`;
	}

	renameColumn(tableName: string, parameters: RenameColumnInterface): string {
		return `ALTER TABLE public.${tableName} RENAME COLUMN ${parameters.columnName} TO '${parameters.futureColumnName}';`;
	}

	renameTable(tableName: string, parameters: RenameTableInterface): string {
		return `ALTER TABLE public.${tableName} RENAME TO ${parameters.tableName};`;
	}

	dropTable(tableName: string, parameters: DropTableInterface): string {
		return `DROP TABLE ${parameters.ifExist ? 'IF EXISTS' : ''} '${tableName}' ${parameters.type ? parameters.type : ''}`;
	}
}