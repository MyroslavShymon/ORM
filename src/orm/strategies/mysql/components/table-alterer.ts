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
	DropNotNullFromColumnInterface,
	DropTableInterface
} from '@core/interfaces';
import { AddComputedColumnInterface } from '@core/interfaces/table-manipulation/add-computed-column.interface';
import { TableAltererInterface } from '@strategies/mysql';
import { DatabasesTypes } from '@core/enums';

export class TableAlterer implements TableAltererInterface {
	addColumn(tableName: string, parameters: AddColumnInterface<DatabasesTypes.MYSQL>): string {
		const { columnName, options } = parameters;

		if (!options?.dataType) {
			throw new Error('You did not specify the column data type');
		}

		let columnDefinition = `\`${columnName}\` ${options.dataType}`; // Додано зворотні апострофи для імені стовпця

		switch (options.dataType) {
			case 'CHAR':
			case 'VARCHAR':
				if (!options.length) {
					throw new Error('You did not specify the length of the string');
				}
				columnDefinition += `(${options.length})`;
				break;
			case 'ENUM':
			case 'SET':
				if (!options.values || options.values.length === 0) {
					throw new Error('You must provide values for ENUM or SET types');
				}
				columnDefinition += `('${options.values.join('\',\'')}')`;
				break;
			case 'DECIMAL':
			case 'FLOAT':
			case 'DOUBLE':
				if (options.precision && options.scale) {
					columnDefinition += `(${options.precision},${options.scale})`;
				} else if (options.precision) {
					columnDefinition += `(${options.precision})`;
				}
				break;
		}

		if (options.displayWidth !== undefined) {
			columnDefinition += `(${options.displayWidth})`;
		}

		if (options.isUnsigned) {
			columnDefinition += ' UNSIGNED';
		}

		if (options.isZerofill) {
			columnDefinition += ' ZEROFILL';
		}

		if (options.isAutoIncrement) {
			columnDefinition += ' AUTO_INCREMENT';
		}

		columnDefinition += options.nullable === false ? ' NOT NULL' : ' NULL';

		if (options.unique) {
			columnDefinition += ' UNIQUE';
		}

		if (options.defaultValue !== undefined) {
			const defaultValue = typeof options.defaultValue === 'string'
				? `'${options.defaultValue}'`
				: options.defaultValue;
			columnDefinition += ` DEFAULT ${defaultValue}`;
		}

		if (options.check) {
			columnDefinition += ` CHECK (${options.check})`;
		}

		if (options.nameOfCheckConstraint) {
			columnDefinition += ` CONSTRAINT ${options.nameOfCheckConstraint}`;
		}

		return `ALTER TABLE \`${tableName}\`
            ADD COLUMN ${columnDefinition};`;
	}

	deleteColumn(tableName: string, parameters: DeleteColumnInterface<DatabasesTypes.MYSQL>): string {
		return `ALTER TABLE \`${tableName}\` DROP COLUMN \`${parameters.columnName}\`;`;
	}

	addNotNullToColumn(tableName: string, parameters: AddNotNullToColumnInterface): string {
		return `ALTER TABLE \`${tableName}\` MODIFY COLUMN \`${parameters.columnName}\` NOT NULL;`;
	}

	dropNotNullFromColumn(tableName: string, parameters: DropNotNullFromColumnInterface): string {
		return `ALTER TABLE \`${tableName}\` MODIFY COLUMN \`${parameters.columnName}\` NULL;`;
	}

	addUniqueToColumn(tableName: string, parameters: AddUniqueToColumnInterface<DatabasesTypes.MYSQL>): string {
		return `ALTER TABLE \`${tableName}\`
            ADD UNIQUE (\`${parameters.columnName}\`);`;
	}

	deleteUniqueFromColum(tableName: string, parameters: DeleteUniqueFromColumnInterface): string {
		const indexName = `${tableName}_${parameters.columnName}_unique`;

		return `ALTER TABLE \`${tableName}\` DROP INDEX \`${indexName}\`;`;
	}

	addCheckConstraintToColumn(tableName: string, parameters: AddCheckConstraintToColumnInterface): string {
		let query = `ALTER TABLE \`${tableName}\` MODIFY COLUMN \`${parameters.columnName}\``;

		if (parameters.check && parameters.nameOfCheckConstraint) {
			query += ` ADD CONSTRAINT \`${parameters.nameOfCheckConstraint}\` CHECK (${parameters.check});`;
		} else if (parameters.check) {
			query += ` ADD CHECK (${parameters.check});`;
		} else {
			throw new Error('Не вказано умову перевірки (check).');
		}

		return query;
	}

	deleteCheckConstraintOfColumn(tableName: string, parameters: DeleteCheckConstraintOfColumnInterface): string {
		const constraintName = `${tableName}_${parameters.columnName}_check`;

		return `ALTER TABLE \`${tableName}\` DROP CHECK \`${constraintName}\`;`;
	}

	dropConstraint(tableName: string, parameters: DropConstraintInterface): string {
		return `ALTER TABLE \`${tableName}\` DROP INDEX \`${parameters.constraintName}\`;`;
	}

	changeDataTypeOfColumn(tableName: string, parameters: ChangeColumnDatatypeInterface): string {
		let query = `ALTER TABLE \`${tableName}\` MODIFY COLUMN \`${parameters.columnName}\``;

		if (parameters.length) {
			query += ` ${parameters.dataType}(${parameters.length})`;
		} else if (parameters.precision !== undefined && parameters.scale !== undefined) {
			query += ` ${parameters.dataType}(${parameters.precision}, ${parameters.scale})`;
		} else if (parameters.precision !== undefined) {
			query += ` ${parameters.dataType}(${parameters.precision})`;
		} else {
			query += ` ${parameters.dataType}`;
		}

		return query + ';';
	}

	addPrimaryGeneratedColumn(tableName: string, parameters: AddPrimaryGeneratedColumnInterface<DatabasesTypes.MYSQL>): string {
		let query = `ALTER TABLE \`${tableName}\`
            ADD COLUMN \`${parameters.columnName}\` ${parameters.type} AUTO_INCREMENT`;

		// Додавання опціональних параметрів
		if (parameters.startWith !== undefined) {
			query += ` START WITH ${parameters.startWith}`;
		}
		if (parameters.incrementBy !== undefined) {
			query += ` INCREMENT BY ${parameters.incrementBy}`;
		}
		if (parameters.minValue !== undefined) {
			query += ` MINVALUE ${parameters.minValue}`;
		}
		if (parameters.maxValue !== undefined) {
			query += ` MAXVALUE ${parameters.maxValue}`;
		}
		if (parameters.isCycle) {
			query += ` CYCLE`;
		} else {
			query += ` NO CYCLE`;
		}
		if (parameters.cache !== undefined) {
			query += ` CACHE ${parameters.cache}`;
		}
		if (parameters.ownedBy) {
			query += ` OWNED BY ${parameters.ownedBy}`;
		}

		// Додавання PRIMARY KEY
		query += ` PRIMARY KEY`;

		return query + ';';
	}

	addForeignKey(tableName: string, parameters: AddForeignKeyInterface): string {
		return `
            ALTER TABLE \`${tableName}\`
                ADD CONSTRAINT fk_${tableName}_${parameters.referencedTable}
                FOREIGN KEY (\`${parameters.foreignKey}\`) REFERENCES \`${parameters.referencedTable}\`(\`${parameters.referencedColumn}\`);` + '\n';
	}

	addComputedColumn(tableName: string, parameters: AddComputedColumnInterface<DatabasesTypes.MYSQL>): string {
		const { dataType, calculate, name, stored } = parameters;

		return `
            ALTER TABLE \`${tableName}\`
                ADD COLUMN \`${name}\` ${dataType} GENERATED ALWAYS AS (${calculate}) ${stored ? 'STORED' : 'VIRTUAL'};
		`;
	}

	dropTable(tableName: string, parameters: DropTableInterface<DatabasesTypes.MYSQL>): string {
		return `DROP TABLE ${parameters.ifExist ? 'IF EXISTS ' : ''}${tableName};`;
	}
}