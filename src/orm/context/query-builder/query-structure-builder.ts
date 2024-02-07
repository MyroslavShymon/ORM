import { QueryBuilderInterface, QueryStructureBuilderInterface } from '@context/interfaces';
import { DataSourceInterface } from '@core/interfaces';

export class QueryStructureBuilder<T> implements QueryStructureBuilderInterface<T> {
	private _queryBuilder: QueryBuilderInterface<T>;
	private _dataSource: DataSourceInterface;

	constructor(queryBuilder: QueryBuilderInterface<T>, dataSource: DataSourceInterface) {
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