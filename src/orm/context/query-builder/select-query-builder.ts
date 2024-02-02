import { SelectQueryBuilderInterface } from '@context/interfaces/query-builder/select-query-builder.interface';
import { QueryBuilderInterface } from '@context/interfaces';

export class SelectQueryBuilder<T> implements SelectQueryBuilderInterface {
	private queryBuilder: QueryBuilderInterface<T>;

	constructor(queryBuilder: QueryBuilderInterface<T>, columns: string[]) {
		this.queryBuilder = queryBuilder;
		this.queryBuilder.query += `SELECT ${columns.join(', ')} ${columns.length > 2 ? '\n' : ''}`;
	}

	summing(column: string): void {
		this.queryBuilder.query += `SUM(${column})`;
	}
}