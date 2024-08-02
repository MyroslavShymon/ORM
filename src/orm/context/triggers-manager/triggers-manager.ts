import { DataSourceInterface, DropTriggerInterface, TriggerInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';
import { TriggerManagerInterface } from '@context/common';

export class TriggersManager<DT extends DatabasesTypes> implements TriggerManagerInterface<DT> {
	private readonly _dataSource: DataSourceInterface<DT>;

	constructor(dataSource: DataSourceInterface<DT>) {
		this._dataSource = dataSource;
	}

	async createTrigger<T extends boolean>(
		trigger: TriggerInterface<DT>,
		getString?: true
	): Promise<T extends true ? string : void> {
		const createTriggerQuery = this._dataSource.createTrigger(trigger);

		if (getString) {
			return createTriggerQuery as T extends true ? string : never;
		}

		await this._dataSource.client.query(createTriggerQuery);
	}

	async dropTrigger<T extends boolean>(
		parameters: DropTriggerInterface<DT>,
		getString?: true
	): Promise<T extends true ? string : void> {
		const dropTriggerQuery = this._dataSource.dropTrigger(parameters);

		if (getString) {
			return dropTriggerQuery as T extends true ? string : never;
		}

		await this._dataSource.client.query(dropTriggerQuery);
	}
}