import {
	AddColumnInterface,
	AddNotNullToColumnInterface,
	AddUniqueToColumnInterface,
	ChangeColumnDatatypeInterface,
	DeleteColumnInterface,
	DropNotNullFromColumnInterface
} from '@core/interfaces';
import { DataSourceMySql } from '@strategies/mysql';

export interface TableAltererInterface {
	addColumn(tableName: string, parameters: AddColumnInterface<DataSourceMySql>): string;

	deleteColumn(tableName: string, parameters: DeleteColumnInterface<DataSourceMySql>): string;

	addNotNullToColumn(tableName: string, parameters: AddNotNullToColumnInterface<DataSourceMySql>): string;

	dropNotNullFromColumn(tableName: string, parameters: DropNotNullFromColumnInterface<DataSourceMySql>): string;

	addUniqueToColumn(tableName: string, parameters: AddUniqueToColumnInterface<DataSourceMySql>): string;

	changeDataTypeOfColumn(tableName: string, parameters: ChangeColumnDatatypeInterface): string;
}