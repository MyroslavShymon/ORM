import { UpdateQueryBuilderInterface } from '@context/interfaces/query-builder/update-query-builder.interface';
import { QueryBuilderInterface } from '@context/interfaces';

export class UpdateQueryBuilder<T> implements UpdateQueryBuilderInterface<T> {
	private queryBuilder: QueryBuilderInterface<T>;

	constructor(queryBuilder: QueryBuilderInterface<T>) {
		this.queryBuilder = queryBuilder;
	}

	update(values: Partial<T>, tableName: string): void {
		const setClause = Object.entries(values)
			.map(([column, value]) => `${column} = '${value}'`)
			.join(', ');

		this.queryBuilder.query += `UPDATE ${tableName} SET ${setClause} \n`;
	}
}