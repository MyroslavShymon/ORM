import 'reflect-metadata';
import { ColumnDecoratorInterface, ColumnMetadataInterface } from '@decorators/index';

export function Column({ name, options }: ColumnDecoratorInterface) {
	return function(target: any, propertyKey: string) {

		if (!name) {
			name = propertyKey;
		}

		if (!options.nullable) {
			options.nullable = true;
		}

		const columns: ColumnMetadataInterface[] = Reflect.getMetadata('columns', target) || [];
		columns.push({ name, options, propertyKey });
		Reflect.defineMetadata('columns', columns, target);
	};
}