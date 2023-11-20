import { AlterTableResultInterface } from './alter-table-result.interface';
import { AddColumnInterface, DataSourceInterface } from '../../../core';

export interface TableManipulationInterface {
	alterTable(tableName: string): AlterTableResultInterface<DataSourceInterface>;

	addColumn(tableName: string): (parameters: AddColumnInterface<DataSourceInterface>) => Promise<Object>;

}