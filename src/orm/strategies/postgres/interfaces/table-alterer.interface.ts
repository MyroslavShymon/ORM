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

export interface TableAltererInterface {
	addColumn(tableName: string, parameters: AddColumnInterface<DatabasesTypes.POSTGRES>): string;

	deleteColumn(tableName: string, parameters: DeleteColumnInterface<DatabasesTypes.POSTGRES>): string;

	addNotNullToColumn(tableName: string, parameters: AddNotNullToColumnInterface): string;

	dropNotNullFromColumn(tableName: string, parameters: DropNotNullFromColumnInterface): string;

	addUniqueToColumn(tableName: string, parameters: AddUniqueToColumnInterface<DatabasesTypes.POSTGRES>): string;

	changeDataTypeOfColumn(tableName: string, parameters: ChangeColumnDatatypeInterface): string;

	addCheckConstraintToColumn(tableName: string, parameters: AddCheckConstraintToColumnInterface): string;

	deleteCheckConstraintOfColumn(tableName: string, parameters: DeleteCheckConstraintOfColumnInterface): string;

	dropConstraint(tableName: string, parameters: DropConstraintInterface): string;

	deleteUniqueFromColum(tableName: string, parameters: DeleteUniqueFromColumnInterface): string;

	addPrimaryGeneratedColumn(tableName: string, parameters: AddPrimaryGeneratedColumnInterface<DatabasesTypes.POSTGRES>): string;

	addForeignKey(tableName: string, parameters: AddForeignKeyInterface): string;

	addComputedColumn(tableName: string, parameters: AddComputedColumnInterface<DatabasesTypes.POSTGRES>): string;

	dropTable(tableName: string, parameters: DropTableInterface<DatabasesTypes.POSTGRES>): string;

	addDefaultValue(tableName: string, parameters: AddDefaultValueInterface): string;

	dropDefaultValue(tableName: string, parameters: DropDefaultValueInterface): string;

	renameColumn(tableName: string, parameters: RenameColumnInterface): string;

	renameTable(tableName: string, parameters: RenameTableInterface): string;
}