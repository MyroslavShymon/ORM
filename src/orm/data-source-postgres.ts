import { ColumnInterface, DataSourceInterface, TableInterface } from './interfaces';
import { Pool, PoolClient } from 'pg';
import { ConnectionData } from './types';
import { PostgresqlDataTypes } from './enums';

export class DataSourcePostgres implements DataSourceInterface {
	client: PoolClient;

	async connect(dataToConnect: ConnectionData): Promise<void> {
		const pool = new Pool(dataToConnect);
		this.client = await pool.connect();
	}

	createTable(table: TableInterface, columns: ColumnInterface[]): string {
		console.log('POSTGRES');
		console.log('TABLE', table);
		console.log('COLUMN', columns);

		let createTableSQL;
		createTableSQL = `
                CREATE TABLE IF NOT EXISTS "${table.name}" (
                  id SERIAL PRIMARY KEY,
            `;

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

			//Працюємо з NULL || NOT NULL
			const isNullableString = options.nullable ? 'NULL' : 'NOT NULL';

			// constraint check
			let formCheckConstraint = '';

			if (options.check) {
				formCheckConstraint = `
                ${options.checkConstraint ? `CONSTRAINT ${options.checkConstraint}` : ''} CHECK (${options.check})`;
			}


			//default
			let formDefault = '';

			if (options.default) {
				formDefault = `DEFAULT ${options.default}`;
			}

			//unique

			//NULLS NOT DISTINCT


			return `"${name}" ${options.dataType}${stringLength} ${isNullableString}
             ${formCheckConstraint} ${formDefault} ${options.unique ? 'UNIQUE' : ''} ${options.nullsNotDistinct ? 'NULLS NOT DISTINCT' : ''}`;
		});
		createTableSQL += columnStrings.join(', ');

		createTableSQL += `);`;

		return createTableSQL;
	}
}