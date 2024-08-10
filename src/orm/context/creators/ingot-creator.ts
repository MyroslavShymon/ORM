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
		const preparedItems: T[] = [];
		for (const model of models) {
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
		const existingNames = new Set(currentItemsIngot.map(item => item.indexName)); // або item.name, якщо у вас є indexName
		return preparedItems
			.filter(preparedItem => !existingNames.has(preparedItem.indexName)) // або preparedItem.name
			.map(newItem => ({
				...newItem,
				id: uuidv4() // Генеруємо новий id для нових елементів
			}));
	}

	private _getCommonItems(preparedItems: T[], currentItemsIngot: T[]): T[] {
		return this._findMatchingObjects(currentItemsIngot, preparedItems);
	}

	private _findMatchingObjects(arr1: T[], arr2: T[]): T[] {
		function areObjectsEqual(obj1: Omit<T, 'id'>, obj2: Omit<T, 'id'>) {
			const keys1 = Object.keys(obj1).filter(key => key !== 'id');
			const keys2 = Object.keys(obj2).filter(key => key !== 'id');

			if (keys1.length !== keys2.length) {
				return false;
			}

			return keys1.every(key => obj1[key] === obj2[key]);
		}

		return arr1.filter(obj1 => arr2.some(obj2 => areObjectsEqual(obj1, obj2)));
	}

}