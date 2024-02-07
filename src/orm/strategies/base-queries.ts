import { OrderOperators } from '@context/types';
import { BaseQueriesInterface } from '@strategies/common';
import { QueryBuilderInterface } from '@context/interfaces';

export class BaseQueries implements BaseQueriesInterface {
	select(columns: string[]): string {
		return `SELECT ${columns.join(', ')} ${columns.length > 2 ? '\n' : ''}`;
	}

	orderBy(column: string, order: OrderOperators): string {
		return `ORDER BY ${column} ${order} \n`;
	}

	as(alias: string): string {
		return ` AS ${alias}`;
	}

	limit(count: number): string {
		return `LIMIT ${count} \n`;
	}

	innerJoin(table: string, condition: string): string {
		return `INNER JOIN ${table} ON ${condition} \n`;
	}

	leftJoin(table: string, condition: string): string {
		return `LEFT JOIN ${table} ON ${condition} \n`;
	}

	rightJoin(table: string, condition: string): string {
		return `RIGHT JOIN ${table} ON ${condition} \n`;
	}

	//insert
	setInto(name: string): string {
		return ` INTO ${name} \n`;
	}

	//query structure builder
	from(table: string): string {
		return `FROM ${table} \n`;
	}

	union(queryBuilder: QueryBuilderInterface<Object>): string {
		return `UNION \n ${queryBuilder.build()} \n`;
	}

	unionAll(queryBuilder: QueryBuilderInterface<Object>): string {
		return `UNION ALL \n ${queryBuilder.build()} \n`;
	}

	//aggregate
	summing(column: string): string {
		return `SUM(${column})`;
	}

	counting(column: string): string {
		return `COUNT(${column})`;
	}

	having(condition: string): string {
		return `HAVING ${condition} \n`;
	}

	groupBy(columns: string[]): string {
		return `GROUP BY ${columns.join(', ')} \n`;
	}
}