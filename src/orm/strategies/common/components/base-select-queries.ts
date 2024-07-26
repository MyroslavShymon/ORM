import { BaseSelectQueriesInterface } from '@strategies/common';
import { OrderOperators } from '@core/types';

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
}