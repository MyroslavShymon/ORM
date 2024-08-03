import { DatabaseIngotInterface, TriggerInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';
import { IngotCreator } from '@context/creators/ingot-creator';
import { IngotCreatorInterface } from '@context/common';

export class TriggerCreator<DT extends DatabasesTypes> extends IngotCreator<DT, TriggerInterface<DT>> implements IngotCreatorInterface<TriggerInterface<DT>> {
	getMetadataKey(): keyof DatabaseIngotInterface<DT> {
		return 'triggers';
	}

	validateNames(items: TriggerInterface<DT>[]): void {
		const namesSet = new Set<string>();
		for (const trigger of items) {
			if (namesSet.has(trigger.name)) {
				throw Error(`Duplicate trigger name found: ${trigger.name}`);
			}
			namesSet.add(trigger.name);
		}
	}
}