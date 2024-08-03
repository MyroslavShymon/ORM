import 'reflect-metadata';
import { IndexDecoratorInterface, IndexMetadataInterface } from '@decorators/index/interfaces';
import { constants } from '@core/constants';

export function Index({ tableName, indexName, columns, options }: IndexDecoratorInterface) {
	return function(constructor: Function) {
		if (!tableName) {
			console.info(
				'Ви вказали назву таблиці не коректно або вона відсутня, тому назва буде взята за назвою класу'
			);
			tableName = constructor.name;
		}
		let indexes: IndexMetadataInterface[] = Reflect.getMetadata(constants.decoratorsMetadata.indexes, constructor.prototype) || [];

		indexes.push({ tableName, indexName, columns, options });

		Reflect.defineMetadata(constants.decoratorsMetadata.indexes, indexes, constructor.prototype);
	};
}