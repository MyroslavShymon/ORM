import { EntityInterface } from '../../core';

export interface TableCreatorInterface {
	createTables(entities: EntityInterface[]): Promise<void>;
}