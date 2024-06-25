import { AlterTableResultInterface } from '@context/common';
import { DatabasesTypes } from '@core/enums';

export interface TableManipulationInterface<DT extends DatabasesTypes> {
	alterTable(tableName: string, getQueryString: boolean): AlterTableResultInterface<DT>;
}