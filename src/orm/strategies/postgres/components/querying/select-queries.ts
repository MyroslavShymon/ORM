import { SelectQueriesInterface } from '@strategies/postgres';
import { ConditionParamsType } from '@core/types';

export class SelectQueries implements SelectQueriesInterface {
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
							conditionsArray.push(`${column} IN (${typeof value === 'string' ? value : value.join(', ')})`);
							break;
						case 'eq':
							conditionsArray.push(`${column} = ${this._handleValue(value, operators.isString)}`);
							break;
						case 'neq':
							conditionsArray.push(`${column} != ${this._handleValue(value, operators.isString)}`);
							break;
						case 'gt':
							conditionsArray.push(`${column} > ${this._handleValue(value, operators.isString)}`);
							break;
						case 'gte':
							conditionsArray.push(`${column} >= ${this._handleValue(value, operators.isString)}`);
							break;
						case 'lt':
							conditionsArray.push(`${column} < ${this._handleValue(value, operators.isString)}`);
							break;
						case 'lte':
							conditionsArray.push(`${column} <= ${this._handleValue(value, operators.isString)}`);
							break;
						case 'isString':
							break;
						default:
							conditionsArray.push(`${column} ${operator} ${this._handleValue(value, operators.isString)}`);
							break;
					}
				}
			}
		}

		const logicalOperatorString = params.logicalOperator === 'or' ? ' OR ' : ' AND ';
		return conditionsArray.length > 0 ? `WHERE ${conditionsArray.join(logicalOperatorString)} \n` : '';
	}

	private _handleValue(value: string, isString: boolean = true) {
		if (isString === false) {
			return value;
		}
		return value === 'NULL' || value === 'null' ? 'NULL' : `'${value}'`;
	}
}