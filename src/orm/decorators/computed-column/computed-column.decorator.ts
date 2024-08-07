import { ComputedColumnDecoratorInterface, ComputedColumnMetadataInterface } from '@decorators/index';
import { constants } from '@core/constants';

export function ComputedColumn({ name, calculate, dataType }: ComputedColumnDecoratorInterface) {
	return function(target: any, propertyKey: string) {

		if (!name) {
			name = propertyKey;
		}

		const columns: ComputedColumnMetadataInterface[] = Reflect.getMetadata(constants.decoratorsMetadata.computedColumns, target) || [];
		columns.push({ name, dataType, calculate, propertyKey });
		Reflect.defineMetadata(constants.decoratorsMetadata.computedColumns, columns, target);
	};
}