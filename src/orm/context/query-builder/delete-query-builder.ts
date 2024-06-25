import { DataSourceInterface } from '@core/interfaces';
import { DeleteQueryBuilderInterface, QueryBuilderInterface } from '@context/common';
import { DatabasesTypes } from '@core/enums';

export class DeleteQueryBuilder<T, DT extends DatabasesTypes> implements DeleteQueryBuilderInterface {
	private _queryBuilder: QueryBuilderInterface<T>;
	private _dataSource: DataSourceInterface<DT>;

	constructor(queryBuilder: QueryBuilderInterface<T>, dataSource: DataSourceInterface<DT>) {
		this._queryBuilder = queryBuilder;
		this._dataSource = dataSource;
	}

	deleting(tableName: string): void {
		this._queryBuilder.query += this._dataSource.deleting(tableName);
	}
}