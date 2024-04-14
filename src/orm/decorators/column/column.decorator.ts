import 'reflect-metadata';
import { ColumnDecoratorInterface, ColumnMetadataInterface } from '@decorators/index';

export function Column(decoratorOptions?: ColumnDecoratorInterface) {
	return function(target: any, propertyKey: string) {
		let name = propertyKey;
		let options = { nullable: true };

		if (decoratorOptions) {
			name = decoratorOptions.name || propertyKey;
			options = { ...options, ...decoratorOptions };
		}

		const columns: ColumnMetadataInterface[] = Reflect.getMetadata('columns', target) || [];
		columns.push({ name, options, propertyKey });
		Reflect.defineMetadata('columns', columns, target);
	};
}