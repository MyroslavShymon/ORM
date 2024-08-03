import { DropIndexInterface, IndexInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';
import { IndexAltererInterface } from '@strategies/mysql';

export class IndexAlterer implements IndexAltererInterface {
	createIndex(index: IndexInterface<DatabasesTypes.MYSQL>): string {
		const options = index.options || {};
		const unique = options.isUnique ? 'UNIQUE ' : '';
		const fulltext = options.isFulltext ? 'FULLTEXT ' : '';
		const spatial = options.isSpatial ? 'SPATIAL ' : '';
		const includedColumns = options.included && options.included.length > 0
			? ` (${options.included.join(', ')})`
			: '';

		return `
        CREATE ${unique}${fulltext}${spatial}INDEX IF NOT EXISTS ${index.indexName}
        ON ${index.tableName} (${index.columns.join(', ')})${includedColumns};
    ` + '\n';
	}

	dropIndex(parameters: DropIndexInterface<DatabasesTypes.MYSQL>): string {
		return `
			DROP INDEX ${parameters.indexName}
			ON ${parameters.tableName};
		` + '\n';
	}
}