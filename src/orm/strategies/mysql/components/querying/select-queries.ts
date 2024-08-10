import { ConditionParamsType, JoinCondition, OrderOperators } from '@core/types';
import { SelectQueriesInterface } from '@strategies/common';

export class SelectQueries implements SelectQueriesInterface {
	select(columns: string[]): string {
		if (columns[0] === '*') {
			return `SELECT *`;
		}
		return `SELECT ${columns.map(col => `\`${col}\``).join(', ')} ${columns.length > 2 ? '\n' : ''}`;
	}

	orderBy(column: string, order: OrderOperators): string {
		return `ORDER BY \`${column}\` ${order} \n`;
	}

	as(alias: string): string {
		return ` AS \`${alias}\``;
	}

	innerJoin(table: string, condition: JoinCondition): string {
		const { column, operator, value } = condition;
		let placeholder = value;

		if (operator === 'IN' && Array.isArray(value)) {
			placeholder = value.map((val) => val).join(', ');
		}

		return `INNER JOIN \`${table}\` ON \`${column}\` ${operator} ${placeholder} \n`;
	}

	leftJoin(table: string, condition: JoinCondition): string {
		const { column, operator, value } = condition;
		let placeholder = value;

		if (operator === 'IN' && Array.isArray(value)) {
			placeholder = value.map((val) => val).join(', ');
		}

		return `LEFT JOIN \`${table}\` ON \`${column}\` ${operator} ${placeholder} \n`;
	}

	rightJoin(table: string, condition: JoinCondition): string {
		const { column, operator, value } = condition;
		let placeholder = value;

		if (operator === 'IN' && Array.isArray(value)) {
			placeholder = value.map((val) => val).join(', ');
		}


		return `RIGHT JOIN \`${table}\` ON \`${column}\` ${operator} ${placeholder} \n`;
	}

	where(params: ConditionParamsType): string {
		if (typeof params === 'string') {
			return `WHERE ${params} \n`;
		}

		if (params.exists) {
			return `WHERE EXISTS (${params.exists}) \n`;
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
							conditionsArray.push(`\`${column}\` IN (${typeof value === 'string' || 'number' ? '?' : value.map(() => '?').join(', ')})`);
							break;
						case 'eq':
							conditionsArray.push(`\`${column}\` = ?`);
							break;
						case 'neq':
							conditionsArray.push(`\`${column}\` != ?`);
							break;
						case 'gt':
							conditionsArray.push(`\`${column}\` > ?`);
							break;
						case 'gte':
							conditionsArray.push(`\`${column}\` >= ?`);
							break;
						case 'lt':
							conditionsArray.push(`\`${column}\` < ?`);
							break;
						case 'lte':
							conditionsArray.push(`\`${column}\` <= ?`);
							break;
						case 'isString':
							break;
						default:
							conditionsArray.push(`\`${column}\` ${operator} ?`);
							break;
					}
				}
			}
		}

		const logicalOperatorString = params.logicalOperator === 'or' ? ' OR ' : ' AND ';
		return conditionsArray.length > 0 ? `WHERE ${conditionsArray.join(logicalOperatorString)} \n` : '';
	}
}