import {
	InsertQueryBuilderInterface,
	QueryBuilderInterface,
	QueryStructureBuilderInterface
} from '@context/interfaces';
import { Condition, LogicalOperators, OrderOperators } from '@context/types';
import { SelectQueryBuilderInterface } from '@context/interfaces/query-builder/select-query-builder.interface';
import { SelectQueryBuilder } from '@context/query-builder/select-query-builder';
import { InsertQueryBuilder } from '@context/query-builder/insert-query-builder';
import { AggregateQueryBuilderInterface } from '@context/interfaces/query-builder/aggregate-query-builder.interface';
import { AggregateQueryBuilder } from '@context/query-builder/aggregate-query-builder';
import { DeleteQueryBuilder } from '@context/query-builder/delete-query-builder';
import { DeleteQueryBuilderInterface } from '@context/interfaces/query-builder/delete-query-builder.interface';
import { UpdateQueryBuilderInterface } from '@context/interfaces/query-builder/update-query-builder.interface';
import { UpdateQueryBuilder } from '@context/query-builder/update-query-builder';
import { QueryStructureBuilder } from '@context/query-builder/query-structure-builder';

export class QueryBuilder<T> implements QueryBuilderInterface<T> {
	query: string;

	private readonly queryMethod: (sql: string) => Promise<Object>;

	private selectQueryBuilder: SelectQueryBuilderInterface<T> = new SelectQueryBuilder<T>(this);
	private insertQueryBuilder: InsertQueryBuilderInterface<T> = new InsertQueryBuilder<T>(this);
	private updateQueryBuilder: UpdateQueryBuilderInterface<T> = new UpdateQueryBuilder<T>(this);
	private deleteQueryBuilder: DeleteQueryBuilderInterface = new DeleteQueryBuilder<T>(this);
	private aggregateQueryBuilder: AggregateQueryBuilderInterface = new AggregateQueryBuilder<T>(this);
	private queryStructureBuilder: QueryStructureBuilderInterface<T> = new QueryStructureBuilder<T>(this);

	constructor(methodForQuery?: (sql: string) => Promise<Object>) {
		this.queryMethod = methodForQuery;
		this.query = '';
	}

	//Select query
	select(columns: string[] = ['*']): QueryBuilderInterface<T> {
		this.selectQueryBuilder.select(columns);
		return this;
	}

	orderBy(column: string, order: OrderOperators = 'ASC'): QueryBuilderInterface<T> {
		this.selectQueryBuilder.orderBy(column, order);
		return this;
	}

	as(alias: string): QueryBuilderInterface<T> {
		this.selectQueryBuilder.as(alias);
		return this;
	}

	limit(count: number): QueryBuilderInterface<T> {
		this.selectQueryBuilder.limit(count);
		return this;
	}

	innerJoin(table: string, condition: string): QueryBuilderInterface<T> {
		this.selectQueryBuilder.innerJoin(table, condition);
		return this;
	}

	leftJoin(table: string, condition: string): QueryBuilderInterface<T> {
		this.selectQueryBuilder.leftJoin(table, condition);
		return this;
	}

	rightJoin(table: string, condition: string): QueryBuilderInterface<T> {
		this.selectQueryBuilder.rightJoin(table, condition);
		return this;
	}

	where(params: { conditions?: Condition<T>, logicalOperator?: LogicalOperators, exists?: string } | string): QueryBuilderInterface<T> {
		this.selectQueryBuilder.where(params);
		return this;
	}

	//Insert query
	insert(values: Partial<T>, tableName: string): QueryBuilderInterface<T> {
		this.insertQueryBuilder.insert(values, tableName);
		return this;
	}

	insertMany(values: Partial<T>[], tableName: string): QueryBuilderInterface<T> {
		this.insertQueryBuilder.insertMany(values, tableName);
		return this;
	}

	into(name: string): QueryBuilderInterface<T> {
		this.insertQueryBuilder.setInto(name);
		return this;
	}

	//Update query
	update(values: Partial<T>, tableName: string): QueryBuilderInterface<T> {
		this.updateQueryBuilder.update(values, tableName);
		return this;
	}

	//Delete query
	delete(tableName: string): QueryBuilderInterface<T> {
		this.deleteQueryBuilder.deleting(tableName);
		return this;
	}

	//Aggregate functions
	sum(column: string): QueryBuilderInterface<T> {
		this.aggregateQueryBuilder.summing(column);
		return this;
	}

	count(column: string): QueryBuilderInterface<T> {
		this.aggregateQueryBuilder.counting(column);
		return this;
	}

	having(condition: string): QueryBuilderInterface<T> {
		this.aggregateQueryBuilder.having(condition);
		return this;
	}

	groupBy(columns: string[]): QueryBuilderInterface<T> {
		this.aggregateQueryBuilder.groupBy(columns);
		return this;
	}

	//Query structure builder
	from(table: string): QueryBuilderInterface<T> {
		this.queryStructureBuilder.from(table);
		return this;
	}

	union(queryBuilder: QueryBuilderInterface<T>): QueryBuilderInterface<T> {
		this.queryStructureBuilder.union(queryBuilder);
		return this;
	}

	unionAll(queryBuilder: QueryBuilderInterface<T>): QueryBuilderInterface<T> {
		this.queryStructureBuilder.unionAll(queryBuilder);
		return this;
	}

	createView(name: string): QueryBuilderInterface<T> {
		this.queryStructureBuilder.createView(name);
		return this;
	}

	//Building
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
