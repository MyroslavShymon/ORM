import { ComputedColumnDecoratorInterface, ComputedColumnMetadataInterface } from '@decorators/postgres';

export function ComputedColumn({ name, stored, calculate, dataType }: ComputedColumnDecoratorInterface) {
	return function(target: any, propertyKey: string) {

		if (!name || name === '') {
			name = propertyKey;
		}

		const columns: ComputedColumnMetadataInterface[] = Reflect.getMetadata('computed-columns', target) || [];
		columns.push({ name, dataType, stored, calculate, propertyKey });
		Reflect.defineMetadata('computed-columns', columns, target);
	};
}