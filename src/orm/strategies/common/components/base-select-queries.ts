import { BaseSelectQueriesInterface } from '@strategies/common';
import { OrderOperators } from '@context/types';

export class BaseSelectQueries implements BaseSelectQueriesInterface {
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
}