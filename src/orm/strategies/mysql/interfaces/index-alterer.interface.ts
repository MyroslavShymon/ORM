import { DropIndexInterface, IndexInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';

export interface IndexAltererInterface {
	createIndex(index: IndexInterface<DatabasesTypes.MYSQL>): string;

	dropIndex(parameters: DropIndexInterface<DatabasesTypes.MYSQL>): string;
}