import { DeleteQueryBuilderInterface } from '@context/interfaces/query-builder/delete-query-builder.interface';
import { QueryBuilderInterface } from '@context/interfaces';

export class DeleteQueryBuilder<T> implements DeleteQueryBuilderInterface {
	private queryBuilder: QueryBuilderInterface<T>;

	constructor(queryBuilder: QueryBuilderInterface<T>) {
		this.queryBuilder = queryBuilder;
	}

	deleting(tableName: string): void {
		this.queryBuilder.query += `DELETE FROM ${tableName} \n`;
	}
}