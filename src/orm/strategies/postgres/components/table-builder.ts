import { DataSourcePostgres, TableBuilderInterface } from '@strategies/postgres';
import { ColumnInterface, ComputedColumnInterface, TableInterface } from '@core/interfaces';
import { TableOptionsPostgresqlInterface } from '@decorators/postgres';
import { isArrayArrayOfArrays } from '@utils/index';
import { PostgresqlDataTypes } from '@core/enums';

export class TableBuilder implements TableBuilderInterface {
	createTable(
		table: TableInterface<DataSourcePostgres>,
		columns: ColumnInterface<DataSourcePostgres>[],
		computedColumns: ComputedColumnInterface<DataSourcePostgres>[]
	): string {
		let createTableQuery;
		createTableQuery = `\n\tCREATE TABLE IF NOT EXISTS "${table.name}" (
                  id SERIAL PRIMARY KEY,\n\t\t`;

		if (columns) {
			createTableQuery += this._handleColumns(columns);
		}

		if (computedColumns) {
			createTableQuery += this._handleComputedColumns(computedColumns);
		}

		if (table.options) {
			createTableQuery += this._handleOptionsOfTable(table.options);
		}

		createTableQuery += '\n );';

		return createTableQuery;
	}

	private _handleColumns(columns: ColumnInterface<DataSourcePostgres>[]): string {
		const formattedColumnStrings = columns.map(({ name, options }) => {
			if (!options.dataType) {
				throw new Error('Ви не вказали тип колонки');
			}

			if (
				(options.dataType === PostgresqlDataTypes.CHAR ||
					options.dataType === PostgresqlDataTypes.VARCHAR) && !options.length
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
			const isNullableString = options.nullable ? 'NULL' : 'NOT NULL';
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

	private _handleComputedColumns(computedColumns: ComputedColumnInterface<DataSourcePostgres>[]): string {
		const formattedComputedColumns = computedColumns
			.map(({ name, stored, calculate, dataType }) =>
				`"${name}" ${dataType} GENERATED ALWAYS AS (${calculate}) ${stored === true ? 'STORED' : ''}`);

		return `${formattedComputedColumns.length > 0 ? `, \n\t\t${formattedComputedColumns.join(', \n\t\t')}` : ''}`;
	}

	private _handleOptionsOfTable({ unique, checkConstraint }: TableOptionsPostgresqlInterface): string {
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

		return `${tableOptions.length > 0 ? `,\n\n\t\t${tableOptions.join(', \n\t\t')}` : ''}`;
	}
}