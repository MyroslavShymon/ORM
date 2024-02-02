import { InsertQueryBuilderInterface, QueryBuilderInterface } from '@context/interfaces';

export class InsertQueryBuilder<T> implements InsertQueryBuilderInterface {
	private queryBuilder: QueryBuilderInterface<T>;

	constructor(queryBuilder: QueryBuilderInterface<T>, values: Partial<T>, tableName: string) {
		this.queryBuilder = queryBuilder;

		const columns = Object.keys(values);
		const columnNames = columns.join(', ');
		const columnValues = columns.map(column => `'${values[column]}'`).join(', ');

		this.queryBuilder.query += `INSERT INTO ${tableName} (${columnNames}) VALUES (${columnValues}) \n`;
		return this;
	}

	setInto(name: string): void {
		this.queryBuilder.query += ` INTO ${name} \n`;
	}
}