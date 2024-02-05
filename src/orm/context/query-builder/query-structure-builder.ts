import { QueryBuilderInterface, QueryStructureBuilderInterface } from '@context/interfaces';

export class QueryStructureBuilder<T> implements QueryStructureBuilderInterface<T> {
	private queryBuilder: QueryBuilderInterface<T>;

	constructor(queryBuilder: QueryBuilderInterface<T>) {
		this.queryBuilder = queryBuilder;
	}

	createView(name: string): void {
		this.queryBuilder.query = `CREATE VIEW ${name} AS \n` + this.queryBuilder.query;
	}

	from(table: string): void {
		this.queryBuilder.query += `FROM ${table} \n`;
	}

	union(queryBuilder: QueryBuilderInterface<T>): void {
		this.queryBuilder.query += `UNION \n ${queryBuilder.build()} \n`;
	}

	unionAll(queryBuilder: QueryBuilderInterface<T>): void {
		this.queryBuilder.query += `UNION ALL \n ${queryBuilder.build()} \n`;
	}
}