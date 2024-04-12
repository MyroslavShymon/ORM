import 'reflect-metadata';
import { ColumnMetadataInterface } from '@decorators/index';
import { StringDecoratorInterface as StringDecoratorInterface } from './interfaces/string/string-decorator.interface';
import { StringTypesWithParams } from '@decorators/types/constants';

export function String({ type, length }: StringDecoratorInterface) {
	return function(target: any, propertyKey: string) {
		if (StringTypesWithParams.includes(type) && !length) {
			throw new Error('Ви не вказали довжину рядка в декораторі String');
		}

		if (!StringTypesWithParams.includes(type) && length) {
			throw new Error('В декораторі String не потрібна довжина рядка');
		}

		let columns: ColumnMetadataInterface[] = Reflect.getMetadata('columns', target) || [];

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