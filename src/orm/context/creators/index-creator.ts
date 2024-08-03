import { DatabasesTypes } from '@core/enums';
import { DatabaseIngotInterface, IndexInterface } from '@core/interfaces';
import { IngotCreator } from '@context/creators/ingot-creator';
import { IngotCreatorInterface } from '@context/common';

export class IndexCreator<DT extends DatabasesTypes> extends IngotCreator<DT, IndexInterface<DT>> implements IngotCreatorInterface<IndexInterface<DT>> {
	getMetadataKey(): keyof DatabaseIngotInterface<DT> {
		return 'indexes';
	}

	validateNames(items: IndexInterface<DT>[]): void {
		const namesSet = new Set<string>();
		for (const index of items) {
			if (namesSet.has(index.indexName)) {
				throw Error(`Duplicate index name found: ${index.indexName}`);
			}
			namesSet.add(index.indexName);
		}
	}
}