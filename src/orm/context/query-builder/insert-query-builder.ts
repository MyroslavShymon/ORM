import { InsertQueryBuilderInterface, QueryBuilderInterface } from '@context/common';
import { DataSourceInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';

export class InsertQueryBuilder<T, DT extends DatabasesTypes> implements InsertQueryBuilderInterface<T> {
	private _queryBuilder: QueryBuilderInterface<T>;
	private _dataSource: DataSourceInterface<DT>;

	constructor(queryBuilder: QueryBuilderInterface<T>, dataSource: DataSourceInterface<DT>) {
		this._queryBuilder = queryBuilder;
		this._dataSource = dataSource;
	}

	insert(values: Partial<T>, tableName: string): void {
		this._queryBuilder.query += this._dataSource.insert(values, tableName);
	}

	insertMany(values: Partial<T>[], tableName: string): void {
		this._queryBuilder.query += this._dataSource.insertMany(values, tableName);
	}

	setInto(name: string): void {
		this._queryBuilder.query += this._dataSource.setInto(name);
	}
}