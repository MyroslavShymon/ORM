import { DatabasesTypes } from '@core/enums';
import { IndexOptionsInterface } from '@core/interfaces';

export interface IndexMetadataInterface<DT extends DatabasesTypes | undefined = undefined> {
	indexName: string;
	columns: string[];
	tableName?: string;
	options?: IndexOptionsInterface<DT>;
}