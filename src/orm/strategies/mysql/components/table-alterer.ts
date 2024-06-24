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
import { TableAltererInterface } from '@strategies/mysql';
import { DatabasesTypes } from '@core/enums';

export class TableAlterer implements TableAltererInterface {
	// addColumn(tableName: string, parameters: AddColumnInterface<DatabasesTypes.MYSQL>): string {
	addColumn(tableName: string, parameters: AddColumnInterface): string {
		return `ALTER TABLE '${tableName}' ADD '${parameters.columnName}' ${parameters.options.dataType};`;
	}

	deleteColumn(tableName: string, parameters: DeleteColumnInterface<DatabasesTypes.MYSQL>): string {
		return `ALTER TABLE '${tableName}' DROP COLUMN '${parameters}';`;
	}

	addNotNullToColumn(tableName: string, parameters: AddNotNullToColumnInterface<DatabasesTypes.MYSQL>): string {
		if (!parameters.columnType) {
			throw new Error(`There is no datatype of column`);
		}
		return `ALTER TABLE ${tableName} MODIFY COLUMN ${parameters.columnName} ${parameters.columnType}${parameters.typeLength ? `(${parameters.typeLength})` : ''} NOT NULL;`;
	}

	dropNotNullFromColumn(tableName: string, parameters: DropNotNullFromColumnInterface<DatabasesTypes.MYSQL>): string {
		if (!parameters.columnType) {
			throw new Error(`There is no datatype of column`);
		}
		return `ALTER TABLE ${tableName} MODIFY COLUMN ${parameters.columnName} ${parameters.columnType}${parameters.typeLength ? `(${parameters.typeLength})` : ''} NULL;`;
	}

	addUniqueToColumn(tableName: string, parameters: AddUniqueToColumnInterface<DatabasesTypes.MYSQL>): string {
		return `ALTER TABLE ${tableName} ADD UNIQUE (${parameters.columnName});`;
	}

	addCheckConstraintToColumn(tableName: string, parameters: AddCheckConstraintToColumnInterface): string {
		let query = `ALTER TABLE ${tableName} ALTER COLUMN ${parameters.columnName}`;

		if (parameters.check && parameters.nameOfCheckConstraint) {
			query += `, ADD CONSTRAINT ${parameters.nameOfCheckConstraint} CHECK (${parameters.check})`;
		} else if (parameters.check) {
			query += `, ADD CHECK (${parameters.check})`;
		}

		return query;
	}

	deleteCheckConstraintOfColumn(tableName: string, parameters: DeleteCheckConstraintOfColumnInterface): string {
		let query = '';

		return query;
	}

	dropConstraint(tableName: string, parameters: DropConstraintInterface): string {
		let query = ``;

		return query;
	}

	deleteUniqueFromColum(tableName: string, parameters: DeleteUniqueFromColumnInterface): string {
		let query = ``;

		return query;
	}

	changeDataTypeOfColumn(tableName: string, parameters: ChangeColumnDatatypeInterface): string {
		return `ALTER TABLE ${tableName} MODIFY COLUMN ${parameters.columnName} ${parameters.dataType};`;
	}

	addPrimaryGeneratedColumn(tableName: string, parameters: AddPrimaryGeneratedColumnInterface): string {
		return '';
	}

	addForeignKey(tableName: string, parameters: AddForeignKeyInterface): string {
		return '';
	}

	addComputedColumn(tableName: string, parameters: AddComputedColumnInterface): string {
		return '';
	}
}