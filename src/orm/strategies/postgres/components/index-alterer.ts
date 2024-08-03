import { DropIndexInterface, IndexInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';
import { IndexAltererInterface } from '@strategies/postgres';

export class IndexAlterer implements IndexAltererInterface {
	createIndex(index: IndexInterface<DatabasesTypes.POSTGRES>): string {
		const options = index.options || {};
		const unique = options.isUnique ? 'UNIQUE ' : '';
		const includedColumns = options.included && options.included.length > 0
			? ` INCLUDE (${options.included.join(', ')})`
			: '';
		const method = options.isHash ? 'USING HASH'
			: options.isGist ? 'USING GIST'
				: options.isGin ? 'USING GIN'
					: options.isSpgist ? 'USING SPGIST'
						: options.isBrin ? 'USING BRIN'
							: options.bloomWith ? `USING BLOOM WITH (${options.bloomWith})`
								: '';
		const condition = options.condition ? ` WHERE ${options.condition}` : '';

		return `
        CREATE ${unique}INDEX ${index.indexName}
        ON ${index.tableName} ${method} (${index.columns.join(', ')})${includedColumns} ${condition};
    ` + '\n';
	}

	dropIndex(parameters: DropIndexInterface<DatabasesTypes.POSTGRES>): string {
		return `
			DROP INDEX IF EXISTS ${parameters.indexName};
		` + '\n';
	}
}