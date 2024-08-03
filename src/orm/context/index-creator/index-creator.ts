import { v4 as uuidv4 } from 'uuid';
import { DatabasesTypes } from '@core/enums';
import {
	ClassInterface,
	DatabaseIngotInterface,
	DataSourceInterface,
	IndexInterface,
	TableInterface
} from '@core/interfaces';
import { constants } from '@core/constants';
import { ConnectionData } from '@core/types';
import { IndexCreatorInterface } from '@context/common';

export class IndexCreator<DT extends DatabasesTypes> implements IndexCreatorInterface<DT> {
	private readonly _dataSource: DataSourceInterface<DT>;

	constructor(dataSource: DataSourceInterface<DT>) {
		this._dataSource = dataSource;
	}

	async createIngotOfIndex(
		{
			models,
			migrationTable = constants.migrationsTableName,
			migrationTableSchema = constants.migrationsTableSchemaName,
			database
		}: ConnectionData
	): Promise<IndexInterface<DT>[]> {
		if (!models || !models.length) {
			return [];
		}

		const prepareIndexes = this._getPrepareIndexes(models);
		this._validateIndexNames(prepareIndexes);

		let { indexes: currentIndexesIngot }: DatabaseIngotInterface<DT> =
			await this._dataSource.getCurrentDatabaseIngot({
				dataSource: this._dataSource,
				tableName: migrationTable,
				tableSchema: migrationTableSchema,
				databaseName: database
			});

		if (!currentIndexesIngot) {
			return prepareIndexes.map(index => ({ ...index, id: uuidv4() }));
		}

		const newIndexes = this._getNewIndexes(prepareIndexes, currentIndexesIngot);

		const commonIndexes = this._getCommonIndexes(prepareIndexes, currentIndexesIngot);

		return [...commonIndexes, ...newIndexes];
	}

	private _getPrepareIndexes(models: ClassInterface[]): IndexInterface<DT>[] {
		const preparedIndexes = [];
		for (let model of models) {
			const table: TableInterface
				= Reflect.getMetadata(constants.decoratorsMetadata.table, model.prototype);
			const indexes: IndexInterface<DT>[]
				= Reflect.getMetadata(constants.decoratorsMetadata.indexes, model.prototype) || [];

			const preparedModelIndexes = indexes.map(index => index.tableName !== table.name ? {
				...index,
				tableName: table.name
			} : index);

			preparedIndexes.push(...preparedModelIndexes);
		}

		return preparedIndexes;
	}

	private _validateIndexNames(preparedIndexes: IndexInterface<DT>[]): void {
		const namesSet = new Set<string>();
		for (const index of preparedIndexes) {
			if (namesSet.has(index.indexName)) {
				throw Error(`Duplicate index name found: ${index.indexName}`);
			}
			namesSet.add(index.indexName);
		}
	}

	private _getNewIndexes(preparedIndexes: IndexInterface<DT>[], currentIndexesIngot: IndexInterface<DT>[]): IndexInterface<DT>[] {
		return preparedIndexes
			.filter(preparedIndex =>
				!currentIndexesIngot.some(currentIndex => currentIndex.indexName === preparedIndex.indexName)
			)
			.map(newIndex => ({ ...newIndex, id: uuidv4() }));
	}

	private _getCommonIndexes(preparedIndexes: IndexInterface<DT>[], currentIndexesIngot: IndexInterface<DT>[]): IndexInterface<DT>[] {
		return preparedIndexes
			.filter(preparedIndex =>
				currentIndexesIngot.some(currentIndex => preparedIndex.indexName === currentIndex.indexName)
			)
			.map(preparedIndex => {
				const currentIndex = currentIndexesIngot.find(currentIndex => preparedIndex.indexName === currentIndex.indexName);
				return {
					...preparedIndex,
					id: currentIndex?.id
				};
			});
	}
}