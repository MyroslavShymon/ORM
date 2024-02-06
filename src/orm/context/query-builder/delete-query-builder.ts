import { DeleteQueryBuilderInterface } from '@context/interfaces/query-builder/delete-query-builder.interface';
import { QueryBuilderInterface } from '@context/interfaces';
import { DataSourceInterface } from '@core/interfaces';

export class DeleteQueryBuilder<T> implements DeleteQueryBuilderInterface {
	private _queryBuilder: QueryBuilderInterface<T>;
	private _dataSource: DataSourceInterface;

	constructor(queryBuilder: QueryBuilderInterface<T>, dataSource: DataSourceInterface) {
		this._queryBuilder = queryBuilder;
		this._dataSource = dataSource;
	}

	deleting(tableName: string): void {
		this._queryBuilder.query += `DELETE FROM ${tableName} \n`;
	}
}