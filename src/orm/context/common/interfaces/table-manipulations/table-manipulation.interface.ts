import { AlterTableResultInterface } from '@context/common';
import { DataSourceInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';

export interface TableManipulationInterface<DB extends DatabasesTypes | undefined = undefined> {
	alterTable(tableName: string, getQueryString: boolean): AlterTableResultInterface<DataSourceInterface, DB>;
}