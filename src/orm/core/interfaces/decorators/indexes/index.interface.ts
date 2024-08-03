import { IndexOptionsInterface } from '@core/interfaces/decorators/indexes/index-options.interface';
import { DatabasesTypes } from '@core/enums';

export interface IndexInterface<DT extends DatabasesTypes | undefined = undefined> {
	id?: string;
	indexName: string;
	columns: string[];
	tableName?: string;
	options?: IndexOptionsInterface<DT>;
}