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
	alterTable(tableName: string, getQueryString: boolean): AlterTableResultInterface<DataSourceInterface>;

	addColumn(tableName: string, getQueryString: boolean): (parameters: AddColumnInterface<DataSourceInterface>) => Promise<Object>;

	deleteColumn(tableName: string, getQueryString: boolean): (parameters: DeleteColumnInterface) => Promise<Object>;

	addDefaultValue(tableName: string, getQueryString: boolean): (parameters: AddDefaultValueInterface) => Promise<Object>;

	dropDefaultValue(tableName: string, getQueryString: boolean): (parameters: DropDefaultValueInterface) => Promise<Object>;

	changeDataTypeOfColumn(tableName: string, getQueryString: boolean): (parameters: ChangeColumnDatatypeInterface) => Promise<Object>;

	addNotNullToColumn(tableName: string, getQueryString: boolean): (parameters: AddNotNullToColumnInterface) => Promise<Object>;

	dropNotNullFromColumn(tableName: string, getQueryString: boolean): (parameters: DropNotNullFromColumnInterface) => Promise<Object>;

	addUniqueToColumn(tableName: string, getQueryString: boolean): (parameters: AddUniqueToColumnInterface) => Promise<Object>;
}