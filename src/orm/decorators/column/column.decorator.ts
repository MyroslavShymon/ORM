import 'reflect-metadata';
import { ColumnDecoratorInterface, ColumnMetadataInterface, ColumnOptionsDecoratorInterface } from '@decorators/index';

export function Column(decoratorParams?: ColumnDecoratorInterface) {
	return function(target: any, propertyKey: string) {
		let name = propertyKey;
		let options: ColumnOptionsDecoratorInterface = { nullable: true };

		if (decoratorParams) {
			name = decoratorParams.name || propertyKey;
			options = { ...options, ...decoratorParams.options };
		}

		const columns: ColumnMetadataInterface[] = Reflect.getMetadata('columns', target) || [];

		columns.forEach(column => {
			if (!column.options?.dataType) {
				throw Error('Ви не вказали тип колонки!');
			}
		});

		columns.push({ name, options, propertyKey });
		Reflect.defineMetadata('columns', columns, target);
	};
}