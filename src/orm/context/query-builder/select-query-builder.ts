import { DataSourceInterface } from '@core/interfaces';
import { QueryBuilderInterface, SelectQueryBuilderInterface } from '@context/common';
import { Condition, LogicalOperators, OrderOperators } from '@core/types';

export class SelectQueryBuilder<T> implements SelectQueryBuilderInterface<T> {
	private _queryBuilder: QueryBuilderInterface<T>;
	private _dataSource: DataSourceInterface;

	constructor(queryBuilder: QueryBuilderInterface<T>, dataSource: DataSourceInterface) {
		this._queryBuilder = queryBuilder;
		this._dataSource = dataSource;
	}

	select(columns: string[]): void {
		this._queryBuilder.query += this._dataSource.select(columns);
	}

	orderBy(column: string, order: OrderOperators): void {
		this._queryBuilder.query += this._dataSource.orderBy(column, order);
	}

	as(alias: string): void {
		this._queryBuilder.query += this._dataSource.as(alias);
	}

	limit(count: number): void {
		this._queryBuilder.query += this._dataSource.limit(count);
	}

	innerJoin(table: string, condition: string): void {
		this._queryBuilder.query += this._dataSource.innerJoin(table, condition);
	}

	leftJoin(table: string, condition: string): void {
		this._queryBuilder.query += this._dataSource.leftJoin(table, condition);
	}

	rightJoin(table: string, condition: string): void {
		this._queryBuilder.query += this._dataSource.rightJoin(table, condition);
	}

	where(params: {
		conditions?: Condition<T>;
		logicalOperator?: LogicalOperators;
		exists?: string
	} | string): void {
		this._queryBuilder.query += this._dataSource.where(params);
	}
}