import {
	AddCheckConstraintToColumnInterface,
	AddColumnInterface,
	AddDefaultValueInterface,
	AddForeignKeyInterface,
	AddNotNullToColumnInterface,
	AddPrimaryGeneratedColumnInterface,
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
import { AddComputedColumnInterface } from '@core/interfaces/table-manipulation/add-computed-column.interface';

export interface AlterTableResultInterface<DT extends DatabasesTypes> {
	addColumn: (parameters: AddColumnInterface<DT>) => Promise<Object | string>;
	deleteColumn: (parameters: DeleteColumnInterface<DT>) => Promise<Object | string>;
	addDefaultValue: (parameters: AddDefaultValueInterface) => Promise<Object | string>;
	dropDefaultValue: (parameters: DropDefaultValueInterface) => Promise<Object | string>;
	changeDataTypeOfColumn: (parameters: ChangeColumnDatatypeInterface) => Promise<Object | string>;
	addNotNullToColumn: (parameters: AddNotNullToColumnInterface) => Promise<Object | string>;
	dropNotNullFromColumn: (parameters: DropNotNullFromColumnInterface) => Promise<Object | string>;
	addUniqueToColumn: (parameters: AddUniqueToColumnInterface<DT>) => Promise<Object | string>;
	renameColumn: (parameters: RenameColumnInterface) => Promise<Object | string>;
	renameTable: (parameters: RenameTableInterface) => Promise<Object | string>;
	addCheckConstraintToColumn: (parameters: AddCheckConstraintToColumnInterface) => Promise<Object | string>;
	deleteCheckConstraintOfColumn: (parameters: DeleteCheckConstraintOfColumnInterface) => Promise<Object | string>;
	dropConstraint: (parameters: DropConstraintInterface) => Promise<Object | string>;
	deleteUniqueFromColumn: (parameters: DeleteUniqueFromColumnInterface) => Promise<Object | string>;
	addPrimaryGeneratedColumn: (parameters: AddPrimaryGeneratedColumnInterface<DT>) => Promise<Object | string>;
	addForeignKey: (parameters: AddForeignKeyInterface) => Promise<Object | string>;
	addComputedColumn: (parameters: AddComputedColumnInterface<DT>) => Promise<Object | string>;
	dropTable: (parameters: DropTableInterface<DT>) => Promise<Object | string>;
}