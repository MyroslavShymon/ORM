import { AddColumnInterface, DeleteColumnInterface } from '@core/interfaces';
import { DataSourceMySql } from '@strategies/mysql';

export interface TableAltererInterface {
	addColumn(tableName: string, parameters: AddColumnInterface<DataSourceMySql>): string;

	deleteColumn(tableName: string, parameters: DeleteColumnInterface): string;
}