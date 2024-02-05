import { SelectQueryBuilderInterface } from '@context/interfaces/query-builder/select-query-builder.interface';
import { QueryBuilderInterface } from '@context/interfaces';
import { Condition, LogicalOperators, OrderOperators } from '@context/types';

export class SelectQueryBuilder<T> implements SelectQueryBuilderInterface<T> {
	private queryBuilder: QueryBuilderInterface<T>;

	constructor(queryBuilder: QueryBuilderInterface<T>) {
		this.queryBuilder = queryBuilder;
	}

	select(columns: string[]): void {
		this.queryBuilder.query += `SELECT ${columns.join(', ')} ${columns.length > 2 ? '\n' : ''}`;
	}

	orderBy(column: string, order: OrderOperators): void {
		this.queryBuilder.query += `ORDER BY ${column} ${order} \n`;
	}

	as(alias: string): void {
		this.queryBuilder.query += ` AS ${alias}`;
	}

	limit(count: number): void {
		this.queryBuilder.query += `LIMIT ${count} \n`;
	}

	innerJoin(table: string, condition: string): void {
		this.queryBuilder.query += `INNER JOIN ${table} ON ${condition} \n`;
	}

	leftJoin(table: string, condition: string): void {
		this.queryBuilder.query += `LEFT JOIN ${table} ON ${condition} \n`;
	}

	rightJoin(table: string, condition: string): void {
		this.queryBuilder.query += `RIGHT JOIN ${table} ON ${condition} \n`;
	}

	where(params: {
		conditions?: Condition<T>;
		logicalOperator?: LogicalOperators;
		exists?: string
	} | string): void {
		if (typeof params === 'string') {
			this.queryBuilder.query += `WHERE ${params} \n`;
			return;
		}

		if (params.exists) {
			this.queryBuilder.query += `WHERE EXISTS (${params.exists}) \n`;
			return;
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
		this.queryBuilder.query += conditionsArray.length > 0 ? `WHERE ${conditionsArray.join(logicalOperatorString)} \n` : '';
	}

	private _handleValue(value: string, isString: boolean = true) {
		if (isString === false) {
			return value;
		}
		return value === 'NULL' || value === 'null' ? 'NULL' : `'${value}'`;
	}
}