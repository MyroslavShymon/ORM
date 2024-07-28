import { SelectQueryBuilder } from '@context/query-builder/select-query-builder';
import { InsertQueryBuilder } from '@context/query-builder/insert-query-builder';
import { AggregateQueryBuilder } from '@context/query-builder/aggregate-query-builder';
import { DeleteQueryBuilder } from '@context/query-builder/delete-query-builder';
import { UpdateQueryBuilder } from '@context/query-builder/update-query-builder';
import { QueryStructureBuilder } from '@context/query-builder/query-structure-builder';
import { DataSourceInterface } from '@core/interfaces';
import {
	AggregateQueryBuilderInterface,
	CacheInterface,
	DeleteQueryBuilderInterface,
	InsertQueryBuilderInterface,
	QueryBuilderInterface,
	QueryStructureBuilderInterface,
	SelectQueryBuilderInterface,
	UpdateQueryBuilderInterface
} from '@context/common';
import { ConditionParamsType, ConnectionData, JoinCondition, OrderOperators } from '@core/types';
import { DatabasesTypes } from '@core/enums';
import { CacheOptionsInterface } from '@context/common/interfaces/query-builder/cache-options.interface';
import { Crypto } from '@utils/crypto';
import * as console from 'node:console';
import { LoggerInterface, MonitoringInterface, MonitoringType } from '../../monitoring';

export class QueryBuilder<T, DT extends DatabasesTypes> implements QueryBuilderInterface<T> {
	query: string;
	parameters: any[] = [];

	private readonly _dataSource: DataSourceInterface<DT>;
	private readonly _cache: CacheInterface;
	private readonly _connectionData: ConnectionData;
	private readonly _logger: LoggerInterface;
	private readonly _monitoring: MonitoringInterface;
	private readonly queryMethod: (sql: string, params: any[]) => Promise<unknown>;

	private selectQueryBuilder: SelectQueryBuilderInterface<T>;
	private insertQueryBuilder: InsertQueryBuilderInterface<T>;
	private updateQueryBuilder: UpdateQueryBuilderInterface<T>;
	private deleteQueryBuilder: DeleteQueryBuilderInterface;
	private aggregateQueryBuilder: AggregateQueryBuilderInterface;
	private queryStructureBuilder: QueryStructureBuilderInterface<T>;

	constructor(
		dataSource: DataSourceInterface<DT>,
		connectionData: ConnectionData,
		methodForQuery?: (sql: string, params: any[]) => Promise<unknown>,
		cache?: CacheInterface,
		logger?: LoggerInterface,
		monitoring?: MonitoringInterface
	) {
		this.query = '';
		this._dataSource = dataSource;
		this.queryMethod = methodForQuery;
		this._cache = cache;
		this._connectionData = connectionData;
		this._logger = logger;
		this._monitoring = monitoring;

		this.selectQueryBuilder = new SelectQueryBuilder<T, DT>(this, this._dataSource);
		this.insertQueryBuilder = new InsertQueryBuilder<T, DT>(this, this._dataSource);
		this.updateQueryBuilder = new UpdateQueryBuilder<T, DT>(this, this._dataSource);
		this.deleteQueryBuilder = new DeleteQueryBuilder<T, DT>(this, this._dataSource);
		this.aggregateQueryBuilder = new AggregateQueryBuilder<T, DT>(this, this._dataSource);
		this.queryStructureBuilder = new QueryStructureBuilder<T, DT>(this, this._dataSource);
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

	innerJoin(table: string, condition: JoinCondition): QueryBuilderInterface<T> {
		Array.isArray(condition.value) ?
			this.parameters.push(...condition.value)
			: this.parameters.push(condition.value);
		this.selectQueryBuilder.innerJoin(table, condition);
		return this;
	}

	leftJoin(table: string, condition: JoinCondition): QueryBuilderInterface<T> {
		Array.isArray(condition.value) ?
			this.parameters.push(...condition.value)
			: this.parameters.push(condition.value);
		this.selectQueryBuilder.leftJoin(table, condition);
		return this;
	}

	rightJoin(table: string, condition: JoinCondition): QueryBuilderInterface<T> {
		Array.isArray(condition.value) ?
			this.parameters.push(...condition.value)
			: this.parameters.push(condition.value);
		;
		this.selectQueryBuilder.rightJoin(table, condition);
		return this;
	}

	where(params: ConditionParamsType<T>): QueryBuilderInterface<T> {
		this._extractParams(params);
		this.selectQueryBuilder.where(params);
		return this;
	}

	private _extractParams(params: ConditionParamsType<T>): void {
		if (typeof params !== 'string' && params.conditions) {
			const columns = Object.keys(params.conditions);

			for (const column of columns) {
				const operators = params.conditions[column];

				for (const operator in operators) {
					const value = operators[operator];

					switch (operator) {
						case 'in':
							if (Array.isArray(value)) {
								this.parameters.push(...value); // Add all values for IN condition
							}
							break;
						case 'eq':
						case 'neq':
						case 'gt':
						case 'gte':
						case 'lt':
						case 'lte':
							this.parameters.push(value);
							break;
						case 'exists':
							// EXISTS does not use parameters directly
							break;
						default:
							this.parameters.push(value);
							break;
					}
				}
			}
		}
	}

	//Insert query
	insert(values: Partial<T>, tableName: string): QueryBuilderInterface<T> {
		this.parameters.push(...Object.values(values));
		this.insertQueryBuilder.insert(values, tableName);
		return this;
	}

	insertMany(values: Partial<T>[], tableName: string): QueryBuilderInterface<T> {
		for (const value of values) {
			this.parameters.push(...Object.values(value));
		}
		this.insertQueryBuilder.insertMany(values, tableName);
		return this;
	}

	into(name: string): QueryBuilderInterface<T> {
		this.insertQueryBuilder.setInto(name);
		return this;
	}

	//Update query
	update(values: Partial<T>, tableName: string): QueryBuilderInterface<T> {
		this.parameters.push(...Object.values(values));
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

	having(condition: ConditionParamsType<T>): QueryBuilderInterface<T> {
		this._extractParams(condition);
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
		let sql = this.query.trim();

		if (this._connectionData.type === DatabasesTypes.POSTGRES) {
			let counter = 1;
			sql = sql.replace(/\?/g, () => `$${counter++}`);
		}

		return sql + ';';
	}

	buildWithoutSemicolon(): string {
		return this.query.trim();
	}

	async execute(enableMonitoring: boolean = true): Promise<any> {
		const operation = () => this.queryMethod(this.build(), this.parameters);

		try {
			const response = this._monitoring && enableMonitoring
				? await this._monitoring.measureExecutionTime(operation, this.build(), this.parameters)
				: await operation();

			if (this._logger)
				this._logger.log(JSON.stringify(response), this.build(), JSON.stringify(this.parameters));
			return response;
		} catch (error) {
			console.error('Error while querying', error);
			if (this._logger)
				this._logger.error(JSON.stringify(error), this.build(), JSON.stringify(this.parameters));
		}
	}

	//cache
	async cache({ ttl, key }: CacheOptionsInterface, enableMonitoring: boolean = true): Promise<T> {
		if (!this._cache) {
			throw new Error('Cache not set!');
		}
		if (!key) {
			console.info('It is better to set the hashing key so it will be better in terms of performance!');
		}

		const queryExecute = async () => {
			const cacheKey = key || await Crypto.generateCacheKey(this.build());
			const cachedData = await this._cache.get(cacheKey);

			if (cachedData) {
				return JSON.parse(cachedData);
			}

			const dataFromDb = await this.execute(false);
			await this._cache.set(cacheKey, JSON.stringify(dataFromDb), ttl);
			return dataFromDb;
		};

		return this._monitoring && enableMonitoring
			? await this._monitoring.measureExecutionTime(queryExecute, this.build(), this.parameters, MonitoringType.CacheQuery)
			: await queryExecute();
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
// 				const base-querie = beforeOrAnd + afterOrAnd;
// 				console.log('beforeOrAnd', beforeOrAnd);
// 				console.log('afterOrAnd', afterOrAnd);
// 				console.log('aaaaaa', base-querie);
//
// 				this._resultWhere = [base-querie];
// 			}
// 			console.log('conditions array', this._resultWhere);
// 		}
//
// 		return [''];
// 	}
