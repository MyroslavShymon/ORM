import { ConnectionData } from '@core/types';
import {
	ClassInterface,
	DatabaseIngotInterface,
	DataSourceInterface,
	TableInterface,
	TriggerInterface
} from '@core/interfaces';
import { constants } from '@core/constants';
import { DatabasesTypes } from '@core/enums';
import { v4 as uuidv4 } from 'uuid';
import { TriggerCreatorInterface } from '@context/common';

export class TriggerCreator<DT extends DatabasesTypes> implements TriggerCreatorInterface {
	private readonly _dataSource: DataSourceInterface<DT>;

	constructor(dataSource: DataSourceInterface<DT>) {
		this._dataSource = dataSource;
	}

	async createIngotOfTrigger(
		{
			models,
			migrationTable = constants.migrationsTableName,
			migrationTableSchema = constants.migrationsTableSchemaName,
			database
		}: ConnectionData
	): Promise<TriggerInterface[]> {
		if (!models || !models.length) {
			return [];
		}

		const prepareTriggers = this._getPrepareTriggers(models);
		this._validateTriggerNames(prepareTriggers);

		let { triggers: currentTriggersIngot }: DatabaseIngotInterface<DT> =
			await this._dataSource.getCurrentDatabaseIngot({
				dataSource: this._dataSource,
				tableName: migrationTable,
				tableSchema: migrationTableSchema,
				databaseName: database
			});

		if (!currentTriggersIngot) {
			return prepareTriggers.map(trigger => ({ ...trigger, id: uuidv4() }));
		}

		const newTriggers = this._getNewTriggers(prepareTriggers, currentTriggersIngot);

		const commonTriggers = this._getCommonTriggers(prepareTriggers, currentTriggersIngot);

		return [...commonTriggers, ...newTriggers];
	}

	private _getPrepareTriggers(models: ClassInterface[]): TriggerInterface[] {
		const preparedTriggers = [];
		for (let model of models) {
			const table: TableInterface
				= Reflect.getMetadata(constants.decoratorsMetadata.table, model.prototype);
			const triggers: TriggerInterface[]
				= Reflect.getMetadata(constants.decoratorsMetadata.triggers, model.prototype) || [];

			const preparedModelTriggers = triggers.map(trigger => trigger.tableName !== table.name ? {
				...trigger,
				tableName: table.name
			} : trigger);

			preparedTriggers.push(...preparedModelTriggers);
		}

		return preparedTriggers;
	}

	private _validateTriggerNames(preparedTriggers: TriggerInterface[]): void {
		const namesSet = new Set<string>();
		for (const trigger of preparedTriggers) {
			if (namesSet.has(trigger.name)) {
				throw Error(`Duplicate trigger name found: ${trigger.name}`);
			}
			namesSet.add(trigger.name);
		}
	}

	private _getNewTriggers(preparedTriggers: TriggerInterface[], currentTriggersIngot: TriggerInterface[]): TriggerInterface[] {
		return preparedTriggers
			.filter(preparedTrigger =>
				!currentTriggersIngot.some(currentTrigger => currentTrigger.name === preparedTrigger.name)
			)
			.map(newTrigger => ({ ...newTrigger, id: uuidv4() }));
	}

	private _getCommonTriggers(preparedTriggers: TriggerInterface[], currentTriggersIngot: TriggerInterface[]): TriggerInterface[] {
		return preparedTriggers
			.filter(preparedTrigger =>
				currentTriggersIngot.some(currentTrigger => preparedTrigger.name === currentTrigger.name)
			)
			.map(preparedTrigger => {
				const currentTrigger = currentTriggersIngot.find(currentTrigger => preparedTrigger.name === currentTrigger.name);
				return {
					...preparedTrigger,
					id: currentTrigger?.id
				};
			});
	}
}