import { ComputedColumnDecoratorInterface, ComputedColumnMetadataInterface } from '@decorators/index';
import { constants } from '@core/constants';

export function ComputedColumn({ name, stored, calculate, dataType }: ComputedColumnDecoratorInterface) {
	return function(target: any, propertyKey: string) {

		if (!name) {
			name = propertyKey;
		}

		const columns: ComputedColumnMetadataInterface[] = Reflect.getMetadata('computed-columns', target) || [];
		columns.push({ name, dataType, stored, calculate, propertyKey });
		Reflect.defineMetadata(constants.decoratorsMetadata.computedColumns, columns, target);
	};
}