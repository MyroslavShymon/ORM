import { DatabasesTypes } from '@core/enums';
import { DropIndexInterface, IndexInterface } from '@core/interfaces';

export interface IndexManagerInterface<DT extends DatabasesTypes> {
	createIndex<T extends boolean>(
		index: IndexInterface<DT>,
		getString?: true
	): Promise<T extends true ? string : void>;

	dropIndex<T extends boolean>(
		parameters: DropIndexInterface<DT>,
		getString?: true
	): Promise<T extends true ? string : void>;
}