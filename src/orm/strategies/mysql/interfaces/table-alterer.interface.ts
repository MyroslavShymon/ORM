import {
	AddColumnInterface,
	AddDefaultValueInterface,
	AddNotNullToColumnInterface,
	AddUniqueToColumnInterface,
	ChangeColumnDatatypeInterface,
	DeleteColumnInterface,
	DropDefaultValueInterface,
	DropNotNullFromColumnInterface,
	RenameColumnInterface,
	RenameTableInterface
} from '@core/interfaces';
import { DataSourceMySql } from '@strategies/mysql';

export interface TableAltererInterface {
	addColumn(tableName: string, parameters: AddColumnInterface<DataSourceMySql>): string;

	deleteColumn(tableName: string, parameters: DeleteColumnInterface): string;

	addDefaultValue(tableName: string, parameters: AddDefaultValueInterface): string;

	dropDefaultValue(tableName: string, parameters: DropDefaultValueInterface): string;

	changeDataTypeOfColumn(tableName: string, parameters: ChangeColumnDatatypeInterface): string;

	renameColumn(tableName: string, parameters: RenameColumnInterface): string;

	renameTable(tableName: string, parameters: RenameTableInterface): string;

	addNotNullToColumn(tableName: string, parameters: AddNotNullToColumnInterface): string;

	dropNotNullFromColumn(tableName: string, parameters: DropNotNullFromColumnInterface): string;

	addUniqueToColumn(tableName: string, parameters: AddUniqueToColumnInterface): string;
}