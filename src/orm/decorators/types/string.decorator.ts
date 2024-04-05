import 'reflect-metadata';
import { ColumnMetadataInterface, StringDecoratorInterface } from '@decorators/index';

export function String({ type, length }: StringDecoratorInterface) {
	return function(target: any, propertyKey: string) {
		if (!type) {
			throw new Error('Ви не вказали тип');
		}

		if (
			type !== 'TEXT' &&
			type !== 'CHAR' &&
			type !== 'VARCHAR'
		) {
			throw new Error('Ви вказали не вірний тип колонки');
		}

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