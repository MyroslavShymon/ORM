import { ModelInterface } from '@core/interfaces';

export interface TableCreatorInterface {
	createTables(models: ModelInterface[]): Promise<void>;
}