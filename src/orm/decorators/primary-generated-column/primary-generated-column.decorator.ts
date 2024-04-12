import { PrimaryGeneratedColumnDecoratorInterface } from '@decorators/primary-generated-column/interfaces';
import { constants } from '@core/constants';

export function PrimaryGeneratedColumn(options: PrimaryGeneratedColumnDecoratorInterface) {
	return function(target: any, propertyKey: string) {
		Reflect.defineMetadata(constants.decoratorsMetadata.primaryColumn, {
			columnName: propertyKey,
			type: options.type,
			startWith: options?.startWith,
			incrementBy: options?.incrementBy,
			minValue: options?.minValue,
			maxValue: options?.maxValue,
			isCycle: options?.isCycle,
			cache: options?.cache,
			ownedBy: options?.ownedBy,
			restartWith: options?.restartWith,
			noOrder: options?.noOrder
		}, target);
	};
}