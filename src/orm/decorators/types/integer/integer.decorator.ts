import { IntegerDecoratorInterface } from '@decorators/types';
import { ColumnMetadataInterface } from '@decorators/column';
import { constants } from '@core/constants';

export function Integer({ type, ...otherOptions }: IntegerDecoratorInterface) {
	return function(target: any, propertyKey: string) {
		let columns: ColumnMetadataInterface[] = Reflect.getMetadata(constants.decoratorsMetadata.columns, target) || [];

		if (!columns.map(column => column.propertyKey).includes(propertyKey)) {
			throw Error('Декоратор Integer має асоціюватись з декоратором Column');
		}

		columns = columns.map(column => {
			if (column.propertyKey === propertyKey) {
				column.options.dataType = type;
				column.options = { ...column.options, ...otherOptions };
			}

			return column;
		});

		Reflect.defineMetadata(constants.decoratorsMetadata.columns, columns, target);
	};
}