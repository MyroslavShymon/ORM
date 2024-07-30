import { ConditionParamsType } from '@core/types';
import { AggregateQueriesInterface } from '@strategies/common';

export class AggregateQueries implements AggregateQueriesInterface {
	having(params: ConditionParamsType): string {
		if (typeof params === 'string') {
			return `HAVING ${params} \n`;
		}

		if (params.exists) {
			return `HAVING EXISTS (${params.exists}) \n`;
		}

		const conditionsArray: string[] = [];

		if (params.conditions) {
			const columns = Object.keys(params.conditions);

			for (const column of columns) {
				const operators = params.conditions[column];

				for (const operator in operators) {
					const value = operators[operator];

					switch (operator) {
						case 'in':
							conditionsArray.push(`${column} IN (${Array.isArray(value) ? value.map(() => '?').join(', ') : '?'})`);
							break;
						case 'eq':
							conditionsArray.push(`${column} = ?`);
							break;
						case 'neq':
							conditionsArray.push(`${column} != ?`);
							break;
						case 'gt':
							conditionsArray.push(`${column} > ?`);
							break;
						case 'gte':
							conditionsArray.push(`${column} >= ?`);
							break;
						case 'lt':
							conditionsArray.push(`${column} < ?`);
							break;
						case 'lte':
							conditionsArray.push(`${column} <= ?`);
							break;
						case 'isString':
							break;
						default:
							conditionsArray.push(`${column} ${operator} ?`);
							break;
					}
				}
			}
		}

		const logicalOperatorString = params.logicalOperator === 'or' ? ' OR ' : ' AND ';
		return conditionsArray.length > 0 ? `HAVING ${conditionsArray.join(logicalOperatorString)} \n` : '';
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