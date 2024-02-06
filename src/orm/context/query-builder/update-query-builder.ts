import { UpdateQueryBuilderInterface } from '@context/interfaces/query-builder/update-query-builder.interface';
import { QueryBuilderInterface } from '@context/interfaces';
import { DataSourceInterface } from '@core/interfaces';

export class UpdateQueryBuilder<T> implements UpdateQueryBuilderInterface<T> {
	private _queryBuilder: QueryBuilderInterface<T>;
	private _dataSource: DataSourceInterface;

	constructor(queryBuilder: QueryBuilderInterface<T>, dataSource: DataSourceInterface) {
		this._queryBuilder = queryBuilder;
		this._dataSource = dataSource;
	}

	update(values: Partial<T>, tableName: string): void {
		const setClause = Object.entries(values)
			.map(([column, value]) => `${column} = '${value}'`)
			.join(', ');

		this._queryBuilder.query += `UPDATE ${tableName} SET ${setClause} \n`;
	}
}