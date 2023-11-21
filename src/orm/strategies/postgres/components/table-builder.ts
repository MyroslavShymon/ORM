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
		let createTableSQL;
		createTableSQL = `
                CREATE TABLE IF NOT EXISTS "${table.name}" (
                  id SERIAL PRIMARY KEY,
            `;

		if (columns) {
			createTableSQL += this._handleColumnDecorator(columns);
		}

		if (computedColumns) {
			createTableSQL += this._handleComputedColumnDecorator(computedColumns);
		}

		if (table.options) {
			createTableSQL += this._handleOptionsOfTableDecorator(table.options);
		}

		createTableSQL += '\n );';

		return createTableSQL;
	}

	private _handleOptionsOfTableDecorator({ unique, checkConstraint }: TableOptionsPostgresqlInterface): string {
		const tableParameters = [];

		if (checkConstraint) {
			let formTableConstraint;

			if (Array.isArray(checkConstraint)) {
				formTableConstraint = checkConstraint
					.map((constraint) =>
						`${constraint.name ? `CONSTRAINT ${constraint.name}` : ''} CHECK (${constraint.check})`
					)
					.join(', \n\t\t');
			} else {
				formTableConstraint = `${checkConstraint.name ? `CONSTRAINT ${checkConstraint.name}` : ''} CHECK (${checkConstraint.check})\n`;
			}

			tableParameters.push(formTableConstraint);
		}


		if (unique) {
			let formUniqueCombinationColumns;
			const isSeveralUniqueCombinations = isArrayArrayOfArrays(unique);

			if (isSeveralUniqueCombinations) {
				formUniqueCombinationColumns = (unique as string[][])
					.map((uniqueCombination) =>
						`UNIQUE (${uniqueCombination.join(', ')})`
					)
					.join(', \n');
			}

			if (!isSeveralUniqueCombinations) {
				formUniqueCombinationColumns = `UNIQUE (${unique.join(', ')})`;
			}

			tableParameters.push(formUniqueCombinationColumns);
		}

		return `${tableParameters.length > 0 ? `, ${tableParameters.join(', \n\t\t')}` : ''}`;
	}

	private _handleColumnDecorator(columns: ColumnInterface<DataSourcePostgres>[]): string {
		const columnStrings = columns.map(({ name, options }) => {
			if (!options.dataType) {
				throw new Error('Ви не вказали тип колонки');
			}

			if (
				(options.dataType === PostgresqlDataTypes.CHAR ||
					options.dataType === PostgresqlDataTypes.VARCHAR) && !options.length
			) {
				throw new Error('Ви не вказали довжину рядка');
			}

			// Отримуємо довжину рядка і робимо йому правильний формат
			let stringLength = '';

			if (options.length) {
				stringLength = `(${options.length})`;
			}

			// constraint check
			let formConstraint = '';

			if (options.check) {
				formConstraint = `
                ${options.nameOfCheckConstraint ? `CONSTRAINT ${options.nameOfCheckConstraint}` : ''} CHECK (${options.check})`;
			}

			//Працюємо з NULL || NOT NULL
			const isNullableString = options.nullable ? 'NULL' : 'NOT NULL';

			//default
			const formDefaultValue = options.defaultValue ? `DEFAULT ${options.defaultValue}` : '';

			//unique
			const isUnique = options.unique ? 'UNIQUE' : '';

			//NULLS NOT DISTINCT
			const isNullsNotDistinct = options.nullsNotDistinct ? 'NULLS NOT DISTINCT' : '';

			return `"${name}" ${options.dataType}${stringLength} ${isNullableString}
             ${formConstraint} ${formDefaultValue} ${isUnique} ${isNullsNotDistinct} \t`;
		});
		// this.aa
		console.log('columnStrings', columnStrings);
		return columnStrings.join(',');
	}

	private _handleComputedColumnDecorator(computedColumns: ComputedColumnInterface<DataSourcePostgres>[]): string {
		//TODO змінити назву
		const formComputedColumns = computedColumns
			.map(({ name, stored, calculate, dataType }) =>
				`${name} ${dataType} GENERATED ALWAYS AS (${calculate}) ${stored === true ? 'STORED' : ''}`);

		return `${formComputedColumns.length > 0 ? `, ${formComputedColumns.join(', \n\t\t')}` : ''}`;
	}
}