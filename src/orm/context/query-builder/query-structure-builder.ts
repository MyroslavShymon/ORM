import { QueryBuilderInterface, QueryStructureBuilderInterface } from '@context/common';
import { DataSourceInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';

export class QueryStructureBuilder<T, DT extends DatabasesTypes> implements QueryStructureBuilderInterface<T> {
	private _queryBuilder: QueryBuilderInterface<T>;
	private _dataSource: DataSourceInterface<DT>;

	constructor(queryBuilder: QueryBuilderInterface<T>, dataSource: DataSourceInterface<DT>) {
		this._queryBuilder = queryBuilder;
		this._dataSource = dataSource;
	}

	createView(name: string): void {
		this._queryBuilder.query = this._dataSource.createView(name) + this._queryBuilder.query;
	}

	from(table: string): void {
		this._queryBuilder.query += this._dataSource.from(table);
	}

	union(queryBuilder: QueryBuilderInterface<T>): void {
		this._queryBuilder.query += this._dataSource.union(queryBuilder);
	}

	unionAll(queryBuilder: QueryBuilderInterface<T>): void {
		this._queryBuilder.query += this._dataSource.unionAll(queryBuilder);
	}
}