import { InsertQueryBuilderInterface, QueryBuilderInterface } from '@context/interfaces';

export class InsertQueryBuilder<T> implements InsertQueryBuilderInterface<T> {
	private queryBuilder: QueryBuilderInterface<T>;

	constructor(queryBuilder: QueryBuilderInterface<T>) {
		this.queryBuilder = queryBuilder;
	}

	insert(values: Partial<T>, tableName: string): void {
		const columns = Object.keys(values);
		const columnNames = columns.join(', ');
		const columnValues = columns.map(column => `'${values[column]}'`).join(', ');

		this.queryBuilder.query += `INSERT INTO ${tableName} (${columnNames}) VALUES (${columnValues}) \n`;
	}

	insertMany(values: Partial<T>[], tableName: string): void {
		if (!values || values.length === 0) {
			throw new Error('Масив значень для вставки порожній або неправильний.');
		}

		const columns = Object.keys(values[0]);
		const columnNames = columns.join(', ');

		const rows = values.map((row) => {
			const columnValues = columns.map(column => `'${row[column]}'`).join(', ');
			return `(${columnValues})`;
		});

		this.queryBuilder.query += `INSERT INTO ${tableName} (${columnNames}) VALUES ${rows.join(', ')} \n`;
	}

	setInto(name: string): void {
		this.queryBuilder.query += ` INTO ${name} \n`;
	}
}