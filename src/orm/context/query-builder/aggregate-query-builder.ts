import { AggregateQueryBuilderInterface, QueryBuilderInterface } from '@context/common/interfaces';
import { DataSourceInterface } from '@core/interfaces';

export class AggregateQueryBuilder<T> implements AggregateQueryBuilderInterface {
	private _queryBuilder: QueryBuilderInterface<T>;
	private _dataSource: DataSourceInterface;

	constructor(queryBuilder: QueryBuilderInterface<T>, dataSource: DataSourceInterface) {
		this._queryBuilder = queryBuilder;
		this._dataSource = dataSource;
	}

	summing(column: string): void {
		this._queryBuilder.query += this._dataSource.summing(column);
	}

	counting(column: string): void {
		this._queryBuilder.query += this._dataSource.counting(column);
	}

	having(condition: string): void {
		this._queryBuilder.query += this._dataSource.having(condition);
	}

	groupBy(columns: string[]): void {
		this._queryBuilder.query += this._dataSource.groupBy(columns);
	}

}