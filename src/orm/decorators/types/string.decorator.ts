import 'reflect-metadata';
import { ColumnMetadataInterface } from '@decorators/index';
import { StringDecoratorInterface as StringDecoratorInterface } from './interfaces/string/string-decorator.interface';

export function String({ type, length }: StringDecoratorInterface) {
	return function(target: any, propertyKey: string) {
		if ((type === 'CHAR' || type === 'VARCHAR') && !length) {
			throw new Error('Ви не вказали довжину рядка');
		}

		let columns: ColumnMetadataInterface[] = Reflect.getMetadata('columns', target) || [];

		if (columns)
			columns = columns.map(column => {
				if (column.propertyKey === propertyKey) {
					column.options.dataType = type;
					column.options.length = length;
				}

				return column;
			});

		Reflect.defineMetadata('columns', columns, target);
	};
}