import 'reflect-metadata';
import { constants } from '@core/constants';
import { StringDecoratorInterface, StringTypesWithParams } from '@decorators/types';
import { ColumnMetadataInterface } from '@decorators/column';

export function String({ type, length }: StringDecoratorInterface) {
	return function(target: any, propertyKey: string) {
		if (StringTypesWithParams.includes(type) && !length) {
			throw new Error('Ви не вказали довжину рядка в декораторі String');
		}

		if (!StringTypesWithParams.includes(type) && length) {
			throw new Error('В декораторі String не потрібна довжина рядка');
		}

		let columns: ColumnMetadataInterface[] = Reflect.getMetadata(constants.decoratorsMetadata.columns, target) || [];

		columns = columns.map(column => {
			if (column.propertyKey === propertyKey) {
				column.options.dataType = type;
				column.options.length = length;
			}

			return column;
		});

		Reflect.defineMetadata(constants.decoratorsMetadata.columns, columns, target);
	};
}