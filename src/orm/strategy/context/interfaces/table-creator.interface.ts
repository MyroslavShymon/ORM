import { EntityInterface } from '../../../interfaces';

export interface TableCreatorInterface {
	createTables(entities: EntityInterface[]): Promise<void>;
}