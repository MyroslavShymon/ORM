import { AlterTableResultInterface } from '@context/common';
import { DataSourceInterface } from '@core/interfaces';

export interface TableManipulationInterface {
	alterTable(tableName: string, getQueryString: boolean): AlterTableResultInterface<DataSourceInterface>;
}