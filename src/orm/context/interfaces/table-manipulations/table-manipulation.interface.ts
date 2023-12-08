import { AlterTableResultInterface } from '@context/interfaces';
import { AddColumnInterface, DataSourceInterface, DeleteColumnInterface } from '@core/interfaces';

export interface TableManipulationInterface {
	alterTable(tableName: string): AlterTableResultInterface<DataSourceInterface>;

	addColumn(tableName: string): (parameters: AddColumnInterface<DataSourceInterface>) => Promise<Object>;

	deleteColumn(tableName: string): (parameters: DeleteColumnInterface) => Promise<Object>;
}