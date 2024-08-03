import { DropIndexInterface, IndexInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';

export interface IndexAltererInterface {
	createIndex(index: IndexInterface<DatabasesTypes.POSTGRES>): string;

	dropIndex(parameters: DropIndexInterface<DatabasesTypes.POSTGRES>): string;
}