import {
	AddColumnInterface,
	AddDefaultValueInterface,
	AddNotNullToColumnInterface,
	AddUniqueToColumnInterface,
	ChangeColumnDatatypeInterface,
	DeleteColumnInterface,
	DropDefaultValueInterface,
	DropNotNullFromColumnInterface,
	RenameColumnInterface,
	RenameTableInterface
} from '@core/interfaces';

export interface AlterTableResultInterface<DB> {
	addColumn: (parameters: AddColumnInterface<DB>) => Promise<Object>;
	deleteColumn: (parameters: DeleteColumnInterface) => Promise<Object>;
	addDefaultValue: (parameters: AddDefaultValueInterface) => Promise<Object>;
	dropDefaultValue: (parameters: DropDefaultValueInterface) => Promise<Object>;
	changeDataTypeOfColumn: (parameters: ChangeColumnDatatypeInterface) => Promise<Object>;
	addNotNullToColumn: (parameters: AddNotNullToColumnInterface) => Promise<Object>;
	dropNotNullFromColumn: (parameters: DropNotNullFromColumnInterface) => Promise<Object>;
	addUniqueToColumn: (parameters: AddUniqueToColumnInterface) => Promise<Object>;
	renameColumn: (parameters: RenameColumnInterface) => Promise<Object>;
	renameTable: (parameters: RenameTableInterface) => Promise<Object>;
}