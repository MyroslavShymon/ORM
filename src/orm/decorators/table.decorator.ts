import 'reflect-metadata';
import { TableDecoratorInterface } from '../interfaces/decorators/table/table-decorator.interface';

export function Table({ name, options }: TableDecoratorInterface) {
	return function(constructor: Function) {

		if (!name || name === '') {
			console.info(
				'Ви вказали назву таблиці не коректно або вона відсутня, тому назва буде взята за назвою класу'
			);
			name = constructor.name;
		}

		Reflect.defineMetadata('table', { name, options }, constructor.prototype);
	};
}
