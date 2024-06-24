import { TableBuilderInterface } from '@strategies/postgres';
import {
	ColumnInterface,
	ComputedColumnInterface,
	ForeignKeyInterface,
	ManyToManyInterface,
	OneToManyInterface,
	OneToOneInterface,
	PrimaryGeneratedColumnInterface,
	TableInterface,
	TableOptionsPostgresqlInterface
} from '@core/interfaces';
import { isArrayArrayOfArrays } from '@utils/index';
import { DatabasesTypes } from '@core/enums';

export class TableBuilder implements TableBuilderInterface {
	createTable(
		table?: TableInterface<DatabasesTypes.POSTGRES>,
		columns?: ColumnInterface[],
		computedColumns?: ComputedColumnInterface[],
		foreignKeys?: ForeignKeyInterface[],
		primaryColumn?: PrimaryGeneratedColumnInterface<DatabasesTypes.POSTGRES>,
		oneToOne?: OneToOneInterface[],
		oneToMany?: OneToManyInterface[],
		manyToMany?: ManyToManyInterface[]
	): string {
		let createTableQuery;
		createTableQuery = `\n\tCREATE TABLE IF NOT EXISTS "${table.name}" (\n`;

		if (primaryColumn) {
			createTableQuery += this._handlePrimaryGeneratedColumns(primaryColumn);
		}

		if (columns?.length) {
			createTableQuery += this._handleColumns(columns);
		}

		if (computedColumns?.length) {
			createTableQuery += this._handleComputedColumns(computedColumns);
		}

		if (foreignKeys?.length) {
			createTableQuery += this._handleForeignKeys(foreignKeys);
		}

		if (oneToOne?.length) {
			createTableQuery += this._handleOneToOne(oneToOne);
		}

		if (oneToMany?.length) {
			createTableQuery += this._handleOneToMany(oneToMany);
		}

		if (table.options) {
			createTableQuery += this._handleOptionsOfTable(table.options);
		}

		createTableQuery += '\n );';

		return createTableQuery;
	}

	private _handleOneToMany(oneToManyConnections: OneToManyInterface[]): string {
		const formattedOneToManyConnectionsStrings = oneToManyConnections.map(o2m => `\n\n\t\t${o2m.foreignKey} INTEGER,
			\tCONSTRAINT fk_${o2m.tableName}
			\tFOREIGN KEY(${o2m.foreignKey})
			\t\tREFERENCES ${o2m.tableName}(${o2m.referenceColumn})
		`);

		return formattedOneToManyConnectionsStrings.join(',\n\t\t');
	}

	private _handleOneToOne(oneToOneConnections: OneToOneInterface[]): string {
		const formattedOneToOneConnectionsStrings = oneToOneConnections.map(o2o => `
			${o2o.foreignKey} INTEGER UNIQUE,
			\tCONSTRAINT fk_oo_${o2o.columnName}
			\tFOREIGN KEY(${o2o.foreignKey})
			\t\tREFERENCES ${o2o.table}(${o2o.referenceColumn})\n
		`);

		return formattedOneToOneConnectionsStrings.join(',\n\t\t');
	}

	private _handleColumns(columns: ColumnInterface<DatabasesTypes.POSTGRES>[]): string {
		const formattedColumnStrings = columns.map(({ name, options }) => {
			if (!options.dataType) {
				throw new Error('Ви не вказали тип колонки');
			}

			if (
				(options.dataType === 'CHAR' || options.dataType === 'VARCHAR') && !options.length
			) {
				throw new Error('Ви не вказали довжину рядка');
			}

			const columnAttributes = [`"${name}" ${options.dataType}`];

			// Отримуємо довжину рядка і робимо йому правильний формат

			if (options.length) {
				let stringLength = `(${options.length})`;
				columnAttributes.push(stringLength);
			}

			//Працюємо з NULL || NOT NULL
			const isNullableString = options.nullable ? '' : 'NOT NULL';
			columnAttributes.push(isNullableString);

			// constraint check
			if (options.check) {
				const constraintString = `
                	${options.nameOfCheckConstraint ? `CONSTRAINT ${options.nameOfCheckConstraint} ` : ''} CHECK (${options.check})`;
				columnAttributes.push(constraintString);
			}

			//default
			if (options.defaultValue) {
				const defaultValueString = `DEFAULT ${options.defaultValue}`;
				columnAttributes.push(defaultValueString);
			}
			//unique
			if (options.unique) {
				columnAttributes.push('UNIQUE');
			}

			//NULLS NOT DISTINCT
			if (options.nullsNotDistinct) {
				columnAttributes.push('NULLS NOT DISTINCT');
			}

			return columnAttributes.join(' ');
		});

		return formattedColumnStrings.join(',\n\t\t');
	}

	private _handleComputedColumns(computedColumns: ComputedColumnInterface[]): string {
		const formattedComputedColumns = computedColumns
			.map(({ name, calculate, dataType }) =>
				`"${name}" ${dataType} GENERATED ALWAYS AS (${calculate}) STORED`);

		return `${formattedComputedColumns.length > 0 ? `, \n\t\t${formattedComputedColumns.join(', \n\t\t')}` : ''}`;
	}

	private _handleForeignKeys(foreignKeys: ForeignKeyInterface[]): string {
		let formattedForeignKeys = [];

		for (const foreignKey of foreignKeys) {
			const { key, table, columnName } = foreignKey;

			formattedForeignKeys.push(`
		FOREIGN KEY ("${columnName}") REFERENCES ${table}(${key})`);

		}

		return `${formattedForeignKeys.length > 0 ? `, \n${formattedForeignKeys.join(',')}` : ''}`.trim();
	}

	private _handlePrimaryGeneratedColumns(primaryColumn: PrimaryGeneratedColumnInterface<DatabasesTypes.POSTGRES>) {
		if (!primaryColumn.columnName) {
			throw new Error('Please specify name of the primary column!');
		}

		if (!primaryColumn.type) {
			throw new Error('Please specify type of the primary column!');
		}

		return `\t\t${primaryColumn.columnName} ${primaryColumn.type} PRIMARY KEY,\n\t\t`;
	}

	private _handleOptionsOfTable({ unique, checkConstraint, primaryKeys }: TableOptionsPostgresqlInterface): string {
		const tableOptions = [];

		if (checkConstraint) {
			let formattedCheckConstraint;

			if (Array.isArray(checkConstraint)) {
				formattedCheckConstraint = checkConstraint
					.map((constraint) =>
						`${constraint.name ? `CONSTRAINT "${constraint.name}"` : ''} CHECK (${constraint.check})`
					)
					.join(', \n\t\t');
			} else {
				formattedCheckConstraint = `${checkConstraint.name ? `CONSTRAINT ${checkConstraint.name}` : ''} CHECK (${checkConstraint.check})\n`;
			}

			tableOptions.push(formattedCheckConstraint);
		}

		if (unique) {
			let formattedUniqueColumns;
			const isMultipleUniqueCombinations = isArrayArrayOfArrays(unique);

			if (isMultipleUniqueCombinations) {
				console.log('uniqueCombination', unique);
				formattedUniqueColumns = (unique as string[][])
					.map((uniqueCombination) =>
						`UNIQUE (${uniqueCombination
							.map(column => `"${column}"`)
							.join(', ')})`
					)
					.join(', \n\t\t');
			}

			if (!isMultipleUniqueCombinations) {
				formattedUniqueColumns = `UNIQUE (${unique.map(column => `"${column}"`).join(', ')})`;
			}

			tableOptions.push(formattedUniqueColumns);
		}

		if (primaryKeys) {
			tableOptions.push(`PRIMARY KEY (${primaryKeys.join(', ')})`);
		}

		return `${tableOptions.length > 0 ? `,\n\n\t\t${tableOptions.join(', \n\t\t')}` : ''}`;
	}
}