import { DataSourcePostgres, TableAltererInterface } from '@strategies/postgres';
import {
	AddColumnInterface,
	AddNotNullToColumnInterface,
	AddUniqueToColumnInterface,
	ChangeColumnDatatypeInterface,
	DeleteColumnInterface,
	DropNotNullFromColumnInterface
} from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';

export class TableAlterer implements TableAltererInterface {
	addColumn(tableName: string, parameters: AddColumnInterface<DatabasesTypes.POSTGRES>): string {
		const { columnName, options } = parameters;
		let columnDefinition = `${columnName} ${options?.dataType}`;

		if (options?.length) {
			columnDefinition += `(${options.length})`;
		}

		if (options?.nullable === false) {
			columnDefinition += ` NOT NULL`;
		} else if (options?.nullable === true) {
			columnDefinition += ` NULL`;
		}

		if (options?.unique) {
			columnDefinition += ` UNIQUE`;
		}

		if (options?.defaultValue !== undefined) {
			columnDefinition += ` DEFAULT ${typeof options.defaultValue === 'string' ? `'${options.defaultValue}'` : options.defaultValue}`;
		}

		if (options?.check) {
			columnDefinition += ` CHECK (${options.check})`;
		}

		if (options?.nameOfCheckConstraint) {
			columnDefinition += ` CONSTRAINT ${options.nameOfCheckConstraint}`;
		}

		if (options?.nullsNotDistinct) {
			columnDefinition += ` NULLS NOT DISTINCT`;
		}

		return `ALTER TABLE ${tableName} ADD COLUMN ${columnDefinition};`;
	}

	deleteColumn(tableName: string, parameters: DeleteColumnInterface<DataSourcePostgres>): string {
		return `ALTER TABLE ${tableName} DROP COLUMN ${parameters.columnName} ${parameters.isCascade ? 'CASCADE' : ''};`;
	}

	addNotNullToColumn(tableName: string, parameters: AddNotNullToColumnInterface<DataSourcePostgres>): string {
		return `ALTER TABLE ${tableName} ALTER COLUMN ${parameters.columnName} SET NOT NULL;`;
	}

	dropNotNullFromColumn(tableName: string, parameters: DropNotNullFromColumnInterface<DataSourcePostgres>): string {
		return `ALTER TABLE ${tableName} ALTER COLUMN ${parameters.columnName} DROP NOT NULL;`;
	}

	addUniqueToColumn(tableName: string, parameters: AddUniqueToColumnInterface<DataSourcePostgres>): string {
		return `ALTER TABLE ${tableName} ADD CONSTRAINT ${parameters.constraintName} UNIQUE (${parameters.columnName});`;
	}

	changeDataTypeOfColumn(tableName: string, parameters: ChangeColumnDatatypeInterface): string {
		return `ALTER TABLE ${tableName} ALTER COLUMN ${parameters.columnName} TYPE ${parameters.datatype}${parameters.typeParams ? '(' + parameters.typeParams + ')' : ''};`;
	}
}