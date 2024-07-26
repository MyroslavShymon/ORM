import { AggregateQueryBuilderInterface, QueryBuilderInterface } from '@context/common/interfaces';
import { DataSourceInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';
import { ConditionParamsType } from '@core/types';

export class AggregateQueryBuilder<T, DT extends DatabasesTypes> implements AggregateQueryBuilderInterface {
	private _queryBuilder: QueryBuilderInterface<T>;
	private _dataSource: DataSourceInterface<DT>;

	constructor(queryBuilder: QueryBuilderInterface<T>, dataSource: DataSourceInterface<DT>) {
		this._queryBuilder = queryBuilder;
		this._dataSource = dataSource;
	}

	summing(column: string): void {
		this._queryBuilder.query += this._dataSource.summing(column);
	}

	counting(column: string): void {
		this._queryBuilder.query += this._dataSource.counting(column);
	}

	having(condition: ConditionParamsType<T>): void {
		this._queryBuilder.query += this._dataSource.having(condition);
	}

	groupBy(columns: string[]): void {
		this._queryBuilder.query += this._dataSource.groupBy(columns);
	}
}