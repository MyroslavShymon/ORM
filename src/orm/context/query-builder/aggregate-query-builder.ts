import { AggregateQueryBuilderInterface } from '@context/interfaces/query-builder/aggregate-query-builder.interface';
import { QueryBuilderInterface } from '@context/interfaces';

export class AggregateQueryBuilder<T> implements AggregateQueryBuilderInterface {
	private queryBuilder: QueryBuilderInterface<T>;

	constructor(queryBuilder: QueryBuilderInterface<T>) {
		this.queryBuilder = queryBuilder;
	}

	summing(column: string): void {
		this.queryBuilder.query += `SUM(${column})`;
	}

	counting(column: string): void {
		this.queryBuilder.query += `COUNT(${column})`;
	}

	having(condition: string): void {
		this.queryBuilder.query += `HAVING ${condition} \n`;
	}

	groupBy(columns: string[]): void {
		this.queryBuilder.query += `GROUP BY ${columns.join(', ')} \n`;
	}

}