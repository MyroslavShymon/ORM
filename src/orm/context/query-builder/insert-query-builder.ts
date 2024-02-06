import { InsertQueryBuilderInterface, QueryBuilderInterface } from '@context/interfaces';
import { DataSourceInterface } from '@core/interfaces';

export class InsertQueryBuilder<T> implements InsertQueryBuilderInterface<T> {
	private _queryBuilder: QueryBuilderInterface<T>;
	private _dataSource: DataSourceInterface;

	constructor(queryBuilder: QueryBuilderInterface<T>, dataSource: DataSourceInterface) {
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