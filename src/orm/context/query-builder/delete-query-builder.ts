import { DataSourceInterface } from '@core/interfaces';
import { DeleteQueryBuilderInterface, QueryBuilderInterface } from '@context/common';

export class DeleteQueryBuilder<T> implements DeleteQueryBuilderInterface {
	private _queryBuilder: QueryBuilderInterface<T>;
	private _dataSource: DataSourceInterface;

	constructor(queryBuilder: QueryBuilderInterface<T>, dataSource: DataSourceInterface) {
		this._queryBuilder = queryBuilder;
		this._dataSource = dataSource;
	}

	deleting(tableName: string): void {
		this._queryBuilder.query += this._dataSource.deleting(tableName);
	}
}