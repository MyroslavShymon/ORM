import 'reflect-metadata';
import { IndexDecoratorInterface } from '@decorators/index/interfaces';
import { constants } from '@core/constants';

export function Index({ tableName, indexName, columns, options }: IndexDecoratorInterface) {
	return function(constructor: Function) {
		if (!tableName) {
			console.info(
				'Ви вказали назву таблиці не коректно або вона відсутня, тому назва буде взята за назвою класу'
			);
			tableName = constructor.name;
		}

		Reflect.defineMetadata(constants.decoratorsMetadata.indexes, {
			tableName,
			indexName,
			columns,
			options
		}, constructor.prototype);
	};
}