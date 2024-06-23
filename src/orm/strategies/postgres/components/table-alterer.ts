import { DataSourcePostgres, TableAltererInterface } from '@strategies/postgres';
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
import { DatabasesTypes } from '@core/enums';
import { AddComputedColumnInterface } from '@core/interfaces/table-manipuldation/add-computed-column.interface';

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
		return `ALTER TABLE ${tableName} ${parameters.constraintName ? `ADD CONSTRAINT ${parameters.constraintName}` : ''} UNIQUE (${parameters.columnName});`;
	}

	deleteUniqueFromColum(tableName: string, parameters: DeleteUniqueFromColumnInterface): string {
		const constraintName = `${tableName}_${parameters.columnName}_key`;

		let query = `
			SELECT constraint_name as ${constraintName}
			FROM information_schema.table_constraints
			WHERE table_name = '${tableName}' 
			AND constraint_type = 'UNIQUE';` + '\n';

		query += this.dropConstraint(tableName, { constraintName });

		return query;
	}

	addCheckConstraintToColumn(tableName: string, parameters: AddCheckConstraintToColumnInterface): string {
		let query = `ALTER TABLE ${tableName} ALTER COLUMN ${parameters.columnName}`;

		if (parameters.check && parameters.nameOfCheckConstraint) {
			query += ` ADD CONSTRAINT ${parameters.nameOfCheckConstraint} CHECK (${parameters.check})`;
		} else if (parameters.check) {
			query += ` ADD CHECK (${parameters.check})`;
		}

		return query;
	}

	deleteCheckConstraintOfColumn(tableName: string, parameters: DeleteCheckConstraintOfColumnInterface): string {
		const constraintName = `${tableName}_${parameters.columnName}_check`;

		let query = `
			SELECT constraint_name as ${constraintName}
			FROM information_schema.table_constraints
			WHERE table_name = '${tableName}' 
			AND constraint_type = 'CHECK';` + '\n';

		query += this.dropConstraint(tableName, { constraintName });

		return query;
	}

	dropConstraint(tableName: string, parameters: DropConstraintInterface): string {
		return `
			ALTER TABLE ${tableName} DROP CONSTRAINT ${parameters.constraintName};`;
	}

	changeDataTypeOfColumn(tableName: string, parameters: ChangeColumnDatatypeInterface): string {
		let query = `ALTER TABLE ${tableName} ALTER COLUMN ${parameters.columnName}`;

		if (parameters.length) {
			query += ` TYPE ${parameters.dataType}(${parameters.length})`;
		} else if (parameters.precision !== undefined && parameters.scale !== undefined) {
			query += ` TYPE ${parameters.dataType}(${parameters.precision}, ${parameters.scale})`;
		} else if (parameters.precision !== undefined) {
			query += ` TYPE ${parameters.dataType}(${parameters.precision})`;
		} else {
			query += ` TYPE ${parameters.dataType}`;
		}

		return query + ';';
	}

	addPrimaryGeneratedColumn(tableName: string, parameters: AddPrimaryGeneratedColumnInterface): string {
		let query = `ALTER TABLE ${tableName} ADD COLUMN ${parameters.columnName} ${parameters.type}`;

		// // Додавання опціональних параметрів
		// if (parameters.startWith !== undefined) {
		// 	query += ` START WITH ${parameters.startWith}`;
		// }
		// if (parameters.incrementBy !== undefined) {
		// 	query += ` INCREMENT BY ${parameters.incrementBy}`;
		// }
		// if (parameters.minValue !== undefined) {
		// 	query += ` MINVALUE ${parameters.minValue}`;
		// }
		// if (parameters.maxValue !== undefined) {
		// 	query += ` MAXVALUE ${parameters.maxValue}`;
		// }
		// if (parameters.isCycle) {
		// 	query += ` CYCLE`;
		// } else {
		// 	query += ` NO CYCLE`;
		// }
		// if (parameters.cache !== undefined) {
		// 	query += ` CACHE ${parameters.cache}`;
		// }
		// if (parameters.ownedBy) {
		// 	query += ` OWNED BY ${parameters.ownedBy}`;
		// }
		// if (parameters.restartWith !== undefined) {
		// 	query += ` RESTART WITH ${parameters.restartWith}`;
		// }
		// if (parameters.noOrder) {
		// 	query += ` NOORDER`;
		// }

		// Додавання PRIMARY KEY
		query += ` PRIMARY KEY`;

		return query + ';';
	}

	addForeignKey(tableName: string, parameters: AddForeignKeyInterface): string {
		return `
			ALTER TABLE ${tableName}
			ADD CONSTRAINT fk_${tableName}_${parameters.referencedTable}
			FOREIGN KEY (${parameters.foreignKey}) REFERENCES ${parameters.referencedTable}(${parameters.referencedColumn});` + '\n';
	}

	addComputedColumn(tableName: string, parameters: AddComputedColumnInterface): string {
		const { dataType, calculate, stored } = parameters;
		const storageType = stored ? 'STORED' : 'VIRTUAL';

		return `
        ALTER TABLE ${tableName} 
        ADD COLUMN new_computed_column ${dataType} AS (${calculate}) ${storageType};
    `;
	}
}