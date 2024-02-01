import { QueryBuilderInterface } from '@context/interfaces';
import { Condition, LogicalOperators } from '@context/types';

export class QueryBuilder<T> implements QueryBuilderInterface<T> {
	private query: string;
	private readonly queryMethod: (sql: string) => Promise<Object>;

	constructor(methodForQuery: (sql: string) => Promise<Object>) {
		this.queryMethod = methodForQuery;
		this.query = '';
	}

	createView(name: string): QueryBuilderInterface<T> {
		this.query = `CREATE VIEW ${name} AS \n` + this.query;
		return this;
	}

	select(columns: string[] = ['*']): QueryBuilderInterface<T> {
		this.query += `SELECT ${columns.join(', ')} ${columns.length > 2 ? '\n' : ''}`;
		return this;
	}

	into(name: string): QueryBuilderInterface<T> {
		this.query += ` INTO ${name} \n`;
		return this;
	}

	sum(column: string): QueryBuilderInterface<T> {
		this.query += `SUM(${column})`;
		return this;
	}

	count(column: string): QueryBuilderInterface<T> {
		this.query += `COUNT(${column})`;
		return this;
	}

	having(condition: string): QueryBuilderInterface<T> {
		this.query += `HAVING ${condition} \n`;
		return this;
	}

	as(alias: string): QueryBuilderInterface<T> {
		this.query += ` AS ${alias}`;
		return this;
	}

	groupBy(columns: string[]): QueryBuilderInterface<T> {
		this.query += `GROUP BY ${columns.join(', ')} \n`;
		return this;
	}

	limit(count: number): QueryBuilderInterface<T> {
		this.query += `LIMIT ${count} \n`;
		return this;
	}


	from(table: string): QueryBuilderInterface<T> {
		this.query += `FROM ${table} \n`;
		return this;
	}

	where(params: { conditions?: Condition<T>, logicalOperator?: LogicalOperators, exists?: string } | string): QueryBuilderInterface<T> {
		if (typeof params === 'string') {
			this.query += `WHERE ${params} \n`;
			return this;
		}

		if (params.exists) {
			this.query += `WHERE EXISTS (${params.exists}) \n`;
			return this;
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
		this.query += conditionsArray.length > 0 ? `WHERE ${conditionsArray.join(logicalOperatorString)} \n` : '';
		return this;
	}

	private _handleValue(value: string, isString: boolean = true) {
		if (isString === false) {
			return value;
		}
		return value === 'NULL' || value === 'null' ? 'NULL' : `'${value}'`;
	}

	leftJoin(table: string, condition: string): QueryBuilderInterface<T> {
		this.query += `LEFT JOIN ${table} ON ${condition} \n`;
		return this;
	}

	rightJoin(table: string, condition: string): QueryBuilderInterface<T> {
		this.query += `RIGHT JOIN ${table} ON ${condition} \n`;
		return this;
	}

	innerJoin(table: string, condition: string): QueryBuilderInterface<T> {
		this.query += `INNER JOIN ${table} ON ${condition} \n`;
		return this;
	}

	union(queryBuilder: QueryBuilderInterface<T>): QueryBuilderInterface<T> {
		this.query += `UNION \n ${queryBuilder.build()} \n`;
		return this;
	}

	unionAll(queryBuilder: QueryBuilderInterface<T>): QueryBuilderInterface<T> {
		this.query += `UNION ALL \n ${queryBuilder.build()} \n`;
		return this;
	}

	orderBy(column: string, order: 'ASC' | 'DESC' = 'ASC'): QueryBuilderInterface<T> {
		this.query += `ORDER BY ${column} ${order} \n`;
		return this;
	}

	insert(values: Partial<T>, tableName: string): QueryBuilderInterface<T> {
		const columns = Object.keys(values);
		const columnNames = columns.join(', ');
		const columnValues = columns.map(column => `'${values[column]}'`).join(', ');

		this.query += `INSERT INTO ${tableName} (${columnNames}) VALUES (${columnValues}) \n`;
		return this;
	}

	insertMany(values: Partial<T>[], tableName: string): QueryBuilderInterface<T> {
		if (!values || values.length === 0) {
			throw new Error('Масив значень для вставки порожній або неправильний.');
		}

		const columns = Object.keys(values[0]);
		const columnNames = columns.join(', ');

		const rows = values.map((row) => {
			const columnValues = columns.map(column => `'${row[column]}'`).join(', ');
			return `(${columnValues})`;
		});

		this.query += `INSERT INTO ${tableName} (${columnNames}) VALUES ${rows.join(', ')} \n`;
		return this;
	}

	update(values: Partial<T>, tableName: string): QueryBuilderInterface<T> {
		const setClause = Object.entries(values)
			.map(([column, value]) => `${column} = '${value}'`)
			.join(', ');

		this.query += `UPDATE ${tableName} SET ${setClause} \n`;
		return this;
	}

	delete(tableName: string): QueryBuilderInterface<T> {
		this.query += `DELETE FROM ${tableName} \n`;
		return this;
	}

	build(): string {
		return this.query.trim() + ';';
	}

	buildWithoutSemicolon(): string {
		return this.query.trim();
	}

	execute(): any {
		return this.queryMethod(this.build());
	}
}


//TODO
// age: {
// 	or: {
// 		isMail: {
// 			eq: 'mail',
// 			and: {
// 				lastName: {
// 					eq: 'lastName'
// 				}
// 			}
// 		}
// 	},
// 	gt: 80,
// 	lte: 100,
// },
// product_id: {
// 	eq: 'NULL',
// 	or: {
// 		height_cm: {
// 			gte: 6
// 		}
// 	},
// },
//((age>80 and age <= 100) or (isMail = 'mail' and lastName = 'lastName')) and (product_id = NULL or height_cm >= 6)
// 	where(conditions: Condition<T>): QueryBuilderInterface<T> {
// 		const conditionsArray = this._handleWhere(conditions);
//
// 		this.query += `WHERE ${conditionsArray} \n`;
// 		return this;
// 	}
//
// 	private _handleWhere(conditions: Condition<T>): string[] {
// 		for (const column in conditions) {
// 			const operators = conditions[column];
// 			console.log('column', column);// age
// 			console.log('operators', operators);//{ or: { isMail: {
// 			const conditionsArray: any[] = [];
//
// 			for (const operator in operators) {
// 				const value = operators[operator];
// 				console.log('value', value);//value { isMail: { eq: 'mail', and: { lastName: [Object] } } }
// 				console.log('operator', operator);//or
// 				switch (operator) {
// 					case 'and':
// 					case 'or':
// 						this._handleWhere(value);
// 						this._resultWhere.push(operator);
// 						break;
// 					case 'gt':
// 						this._resultWhere.push(`${column} > ${value}`);
// 						break;
// 					case 'lt':
// 						this._resultWhere.push(`${column} < ${value}`);
// 						break;
// 					case 'gte':
// 						this._resultWhere.push(`${column} >= ${value}`);
// 						break;
// 					case 'lte':
// 						this._resultWhere.push(`${column} <= ${value}`);
// 						break;
// 					case 'eq':
// 						this._resultWhere.push(`${column} = ${value}`);
// 						break;
// 					case 'neq':
// 						this._resultWhere.push(`${column} != ${value}`);
// 						break;
// 					default:
// 						this._resultWhere.push(`${column} ${operator} ${value}`);
// 						break;
// 				}
// 			}
// 			if (
// 				this._resultWhere[this._resultWhere.length - 1] === 'or' ||
// 				this._resultWhere[this._resultWhere.length - 1] === 'and'
// 			) {
// 				console.log('this._resultWhere', this._resultWhere, this._resultWhere.length - 1, this._resultWhere[this._resultWhere.length - 1]);
// 				const condition = this._resultWhere[this._resultWhere.length - 1];
// 				console.log('condition', condition);
// 				this._resultWhere.pop();
// 				let [firstElem, ...other] = this._resultWhere;
// 				if (!firstElem.trim().endsWith('or') && !firstElem.trim().endsWith('and') && firstElem !== '') {
// 					firstElem += 'and ';
// 				}
// 				other = other.filter(item => item !== '');
// 				const block = '( ' + other.join(` ${condition} `) + ' ) ';
//
// 				this._resultWhere = [firstElem + block];
// 			} else if (
// 				this._resultWhere.indexOf('or') !== -1 ||
// 				this._resultWhere.indexOf('and') !== -1
// 			) {
// 				const indexOfOrAnd = this._resultWhere.findIndex(element => element === 'or' || element === 'and');
// 				const beforeOrAnd = JSON.parse(JSON.stringify(this._resultWhere)).slice(0, indexOfOrAnd + 1).join(' ');
// 				const afterOrAnd = JSON.parse(JSON.stringify(this._resultWhere)).slice(indexOfOrAnd + 1).join(' and ');
// 				const a = beforeOrAnd + afterOrAnd;
// 				console.log('beforeOrAnd', beforeOrAnd);
// 				console.log('afterOrAnd', afterOrAnd);
// 				console.log('aaaaaa', a);
//
// 				this._resultWhere = [a];
// 			}
// 			console.log('conditions array', this._resultWhere);
// 		}
//
// 		return [''];
// 	}
