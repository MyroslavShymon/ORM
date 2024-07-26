import { BaseAggregateQueriesInterface } from '@strategies/common';

export class BaseAggregateQueries implements BaseAggregateQueriesInterface {
	constructor() {
	}

	summing(column: string): string {
		return `SUM(${column})`;
	}

	counting(column: string): string {
		return `COUNT(${column})`;
	}

	groupBy(columns: string[]): string {
		return `GROUP BY ${columns.join(', ')} \n`;
	}
}