import { v4 as uuidv4 } from 'uuid';
import { DatabasesTypes } from '@core/enums';
import { ClassInterface, DatabaseIngotInterface, DataSourceInterface, TableInterface } from '@core/interfaces';
import { constants } from '@core/constants';
import { ConnectionData } from '@core/types';
import { IngotCreatorInterface, IngotInterface } from '@context/common';

export abstract class IngotCreator<DT extends DatabasesTypes, T extends IngotInterface<DT>> implements IngotCreatorInterface<T> {
	protected readonly _dataSource: DataSourceInterface<DT>;

	constructor(dataSource: DataSourceInterface<DT>) {
		this._dataSource = dataSource;
	}

	abstract getMetadataKey(): keyof DatabaseIngotInterface<DT>;

	abstract validateNames(items: T[]): void;

	async createIngot(
		{
			models,
			migrationTable = constants.migrationsTableName,
			migrationTableSchema = constants.migrationsTableSchemaName,
			database
		}: ConnectionData
	): Promise<T[]> {
		if (!models || !models.length) {
			return [];
		}

		const preparedItems = this._getPreparedItems(models);
		this.validateNames(preparedItems);

		let currentIngot: DatabaseIngotInterface<DT> =
			await this._dataSource.getCurrentDatabaseIngot({
				dataSource: this._dataSource,
				tableName: migrationTable,
				tableSchema: migrationTableSchema,
				databaseName: database
			});

		const currentItemsIngot = currentIngot[this.getMetadataKey()] as unknown as T[] || [];

		const newItems = this._getNewItems(preparedItems, currentItemsIngot);

		const commonItems = this._getCommonItems(preparedItems, currentItemsIngot);

		return [...commonItems, ...newItems];
	}

	private _getPreparedItems(models: ClassInterface[]): T[] {
		const preparedItems = [];
		for (let model of models) {
			const table: TableInterface = Reflect.getMetadata(constants.decoratorsMetadata.table, model.prototype);
			const items: T[] = Reflect.getMetadata(this.getMetadataKey(), model.prototype) || [];

			const preparedModelItems = items.map(item => item.tableName !== table.name ? {
				...item,
				tableName: table.name
			} : item);

			preparedItems.push(...preparedModelItems);
		}

		return preparedItems;
	}

	private _getNewItems(preparedItems: T[], currentItemsIngot: T[]): T[] {
		return preparedItems
			.filter(preparedItem =>
				!currentItemsIngot.some(currentItem => currentItem.name === preparedItem.name)
			)
			.map(newItem => ({ ...newItem, id: uuidv4() }));
	}

	private _getCommonItems(preparedItems: T[], currentItemsIngot: T[]): T[] {
		return preparedItems
			.filter(preparedItem =>
				currentItemsIngot.some(currentItem => preparedItem.name === currentItem.name)
			)
			.map(preparedItem => {
				const currentItem = currentItemsIngot.find(currentItem => preparedItem.name === currentItem.name);
				return {
					...preparedItem,
					id: currentItem?.id
				};
			});
	}
}