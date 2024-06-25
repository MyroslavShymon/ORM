import { DataSourceInterface } from '@core/interfaces';
import { QueryBuilderInterface, UpdateQueryBuilderInterface } from '@context/common';
import { DatabasesTypes } from '@core/enums';

export class UpdateQueryBuilder<T, DT extends DatabasesTypes> implements UpdateQueryBuilderInterface<T> {
	private _queryBuilder: QueryBuilderInterface<T>;
	private _dataSource: DataSourceInterface<DT>;

	constructor(queryBuilder: QueryBuilderInterface<T>, dataSource: DataSourceInterface<DT>) {
		this._queryBuilder = queryBuilder;
		this._dataSource = dataSource;
	}

	update(values: Partial<T>, tableName: string): void {
		this._queryBuilder.query += this._dataSource.update(values, tableName);
	}
}