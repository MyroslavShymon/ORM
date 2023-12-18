import { AlterTableResultInterface } from '@context/interfaces';
import {
	AddColumnInterface,
	AddDefaultValueInterface,
	AddNotNullToColumnInterface,
	AddUniqueToColumnInterface,
	ChangeColumnDatatypeInterface,
	DataSourceInterface,
	DeleteColumnInterface,
	DropDefaultValueInterface,
	DropNotNullFromColumnInterface
} from '@core/interfaces';

export interface TableManipulationInterface {
	alterTable(tableName: string): AlterTableResultInterface<DataSourceInterface>;

	addColumn(tableName: string): (parameters: AddColumnInterface<DataSourceInterface>) => Promise<Object>;

	deleteColumn(tableName: string): (parameters: DeleteColumnInterface) => Promise<Object>;

	addDefaultValue(tableName: string): (parameters: AddDefaultValueInterface) => Promise<Object>;

	dropDefaultValue(tableName: string): (parameters: DropDefaultValueInterface) => Promise<Object>;

	changeDataTypeOfColumn(tableName: string): (parameters: ChangeColumnDatatypeInterface) => Promise<Object>;

	addNotNullToColumn(tableName: string): (parameters: AddNotNullToColumnInterface) => Promise<Object>;

	dropNotNullFromColumn(tableName: string): (parameters: DropNotNullFromColumnInterface) => Promise<Object>;

	addUniqueToColumn(tableName: string): (parameters: AddUniqueToColumnInterface) => Promise<Object>;
}