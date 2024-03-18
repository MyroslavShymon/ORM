import {
	AddColumnInterface,
	AddNotNullToColumnInterface,
	AddUniqueToColumnInterface,
	ChangeColumnDatatypeInterface,
	DeleteColumnInterface,
	DropNotNullFromColumnInterface
} from '@core/interfaces';
import { DataSourcePostgres } from '@strategies/postgres';

export interface TableAltererInterface {
	addColumn(tableName: string, parameters: AddColumnInterface<DataSourcePostgres>): string;

	deleteColumn(tableName: string, parameters: DeleteColumnInterface<DataSourcePostgres>): string;

	addNotNullToColumn(tableName: string, parameters: AddNotNullToColumnInterface<DataSourcePostgres>): string;

	dropNotNullFromColumn(tableName: string, parameters: DropNotNullFromColumnInterface<DataSourcePostgres>): string;

	addUniqueToColumn(tableName: string, parameters: AddUniqueToColumnInterface<DataSourcePostgres>): string;

	changeDataTypeOfColumn(tableName: string, parameters: ChangeColumnDatatypeInterface): string;
}