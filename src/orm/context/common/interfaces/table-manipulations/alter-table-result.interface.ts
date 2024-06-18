import {
	AddCheckConstraintToColumnInterface,
	AddColumnInterface,
	AddDefaultValueInterface,
	AddNotNullToColumnInterface,
	AddUniqueToColumnInterface,
	ChangeColumnDatatypeInterface,
	DeleteCheckConstraintOfColumnInterface,
	DeleteColumnInterface,
	DeleteUniqueFromColumnInterface,
	DropConstraintInterface,
	DropDefaultValueInterface,
	DropNotNullFromColumnInterface,
	DropTableInterface,
	RenameColumnInterface,
	RenameTableInterface
} from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';

export interface AlterTableResultInterface<DB, GT extends DatabasesTypes | undefined = undefined> {
	addColumn: (parameters: AddColumnInterface<GT>) => Promise<Object | string>;
	deleteColumn: (parameters: DeleteColumnInterface<DB, GT>) => Promise<Object | string>;
	addDefaultValue: (parameters: AddDefaultValueInterface) => Promise<Object | string>;
	dropDefaultValue: (parameters: DropDefaultValueInterface) => Promise<Object | string>;
	changeDataTypeOfColumn: (parameters: ChangeColumnDatatypeInterface) => Promise<Object | string>;
	addNotNullToColumn: (parameters: AddNotNullToColumnInterface<DB>) => Promise<Object | string>;
	dropNotNullFromColumn: (parameters: DropNotNullFromColumnInterface<DB>) => Promise<Object | string>;
	addUniqueToColumn: (parameters: AddUniqueToColumnInterface<DB>) => Promise<Object | string>;
	renameColumn: (parameters: RenameColumnInterface) => Promise<Object | string>;
	renameTable: (parameters: RenameTableInterface) => Promise<Object | string>;
	addCheckConstraintToColumn: (parameters: AddCheckConstraintToColumnInterface) => Promise<Object | string>;
	deleteCheckConstraintOfColumn: (parameters: DeleteCheckConstraintOfColumnInterface) => Promise<Object | string>;
	dropConstraint: (parameters: DropConstraintInterface) => Promise<Object | string>;
	deleteUniqueFromColumn: (parameters: DeleteUniqueFromColumnInterface) => Promise<Object | string>;
	//TODO зробити так, щоб якшо mysql, то показувало б без поля Type в DropTableInterface
	dropTable: (parameters: DropTableInterface) => Promise<Object | string>;
}