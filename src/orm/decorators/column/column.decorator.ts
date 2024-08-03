import 'reflect-metadata';
import { ColumnDecoratorInterface, ColumnMetadataInterface, ColumnOptionsDecoratorInterface } from '@decorators/index';
import { constants } from '@core/constants';

export function Column(decoratorParams?: ColumnDecoratorInterface) {
	return function(target: any, propertyKey: string) {
		let name = propertyKey;
		let options: ColumnOptionsDecoratorInterface = { nullable: true };

		if (decoratorParams) {
			name = decoratorParams.name || propertyKey;
			options = { ...options, ...decoratorParams.options };
		}

		const columns: ColumnMetadataInterface[] = Reflect.getMetadata(constants.decoratorsMetadata.columns, target) || [];

		columns.forEach(column => {
			if (!column.options?.dataType) {
				throw Error('Ви не вказали тип колонки!');
			}
		});

		columns.push({ name, options, propertyKey });
		Reflect.defineMetadata(constants.decoratorsMetadata.columns, columns, target);
	};
}