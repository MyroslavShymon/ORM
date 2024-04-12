import 'reflect-metadata';
import { TableDecoratorInterface } from '@decorators/index';
import { constants } from '@core/constants';

export function Table({ name, options }: TableDecoratorInterface) {
	return function(constructor: Function) {
		if (!name) {
			console.info(
				'Ви вказали назву таблиці не коректно або вона відсутня, тому назва буде взята за назвою класу'
			);
			name = constructor.name;
		}

		Reflect.defineMetadata(constants.decoratorsMetadata.table, { name, options }, constructor.prototype);
	};
}
