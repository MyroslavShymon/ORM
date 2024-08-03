import { DatabasesTypes } from '@core/enums';
import { IndexManagerInterface } from '@context/common';
import { DataSourceInterface, DropIndexInterface, IndexInterface } from '@core/interfaces';

export class IndexesManager<DT extends DatabasesTypes> implements IndexManagerInterface<DT> {
	private readonly _dataSource: DataSourceInterface<DT>;

	constructor(dataSource: DataSourceInterface<DT>) {
		this._dataSource = dataSource;
	}

	async createIndex<T extends boolean>(
		index: IndexInterface<DT>,
		getString?: true
	): Promise<T extends true ? string : void> {
		const createIndexQuery = this._dataSource.createIndex(index);

		if (getString) {
			return createIndexQuery as T extends true ? string : never;
		}

		await this._dataSource.client.query(createIndexQuery);
	}

	async dropIndex<T extends boolean>(
		parameters: DropIndexInterface<DT>,
		getString?: true
	): Promise<T extends true ? string : void> {
		const dropIndexQuery = this._dataSource.dropIndex(parameters);

		if (getString) {
			return dropIndexQuery as T extends true ? string : never;
		}

		await this._dataSource.client.query(dropIndexQuery);
	}
}