import { AddColumnInterface, DeleteColumnInterface } from '@core/interfaces';
import { DataSourcePostgres } from '@strategies/postgres';

export interface TableAltererInterface {
	addColumn(tableName: string, parameters: AddColumnInterface<DataSourcePostgres>): string;

	deleteColumn(tableName: string, parameters: DeleteColumnInterface): string;
}