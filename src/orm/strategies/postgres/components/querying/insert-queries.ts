import { InsertQueriesInterface } from '@strategies/common';

export class InsertQueries implements InsertQueriesInterface {
	insert(values: Partial<unknown>, tableName: string): string {
		const columns = Object.keys(values);
		const columnNames = columns.join(', ');
		const columnValues = columns.map(() => '?').join(', ');

		return `INSERT INTO ${tableName} (${columnNames})
                VALUES (${columnValues})   `;
	}

	insertMany(values: Partial<unknown>[], tableName: string): string {
		if (!values || values.length === 0) {
			throw new Error('Масив значень для вставки порожній або неправильний.');
		}

		const columns = Object.keys(values[0]);
		const columnNames = columns.join(', ');

		const rows = values.map(() => {
			const columnValues = columns.map(() => '?').join(', ');
			return `(${columnValues})`;
		});

		return `INSERT INTO ${tableName} (${columnNames})
                VALUES ${rows.join(', ')}   `;
	}

	setInto(name: string): string {
		return ` INTO ${name} \n`;
	}
}