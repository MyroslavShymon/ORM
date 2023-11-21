import { EntityInterface } from '@core/interfaces';

export interface TableCreatorInterface {
	createTables(entities: EntityInterface[]): Promise<void>;
}