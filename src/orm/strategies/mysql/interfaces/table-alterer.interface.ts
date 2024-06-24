import {
	AddCheckConstraintToColumnInterface,
	AddColumnInterface,
	AddForeignKeyInterface,
	AddNotNullToColumnInterface,
	AddPrimaryGeneratedColumnInterface,
	AddUniqueToColumnInterface,
	ChangeColumnDatatypeInterface,
	DeleteCheckConstraintOfColumnInterface,
	DeleteColumnInterface,
	DeleteUniqueFromColumnInterface,
	DropConstraintInterface,
	DropNotNullFromColumnInterface
} from '@core/interfaces';
import { AddComputedColumnInterface } from '@core/interfaces/table-manipuldation/add-computed-column.interface';
import { DatabasesTypes } from '@core/enums';

export interface TableAltererInterface {
	addColumn(tableName: string, parameters: AddColumnInterface): string;

	deleteColumn(tableName: string, parameters: DeleteColumnInterface<DatabasesTypes.MYSQL>): string;

	addNotNullToColumn(tableName: string, parameters: AddNotNullToColumnInterface): string;

	dropNotNullFromColumn(tableName: string, parameters: DropNotNullFromColumnInterface): string;

	addUniqueToColumn(tableName: string, parameters: AddUniqueToColumnInterface<DatabasesTypes.MYSQL>): string;

	changeDataTypeOfColumn(tableName: string, parameters: ChangeColumnDatatypeInterface): string;

	addCheckConstraintToColumn(tableName: string, parameters: AddCheckConstraintToColumnInterface): string;

	deleteCheckConstraintOfColumn(tableName: string, parameters: DeleteCheckConstraintOfColumnInterface): string;

	dropConstraint(tableName: string, parameters: DropConstraintInterface): string;

	deleteUniqueFromColum(tableName: string, parameters: DeleteUniqueFromColumnInterface): string;

	addPrimaryGeneratedColumn(tableName: string, parameters: AddPrimaryGeneratedColumnInterface<DatabasesTypes.MYSQL>): string;

	addForeignKey(tableName: string, parameters: AddForeignKeyInterface): string;

	addComputedColumn(tableName: string, parameters: AddComputedColumnInterface<DatabasesTypes.MYSQL>): string;
}