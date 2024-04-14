import { ColumnMetadataInterface } from '@decorators/column';
import { constants } from '@core/constants';

export function Boolean() {
	return function(target: any, propertyKey: string) {
		let columns: ColumnMetadataInterface[] = Reflect.getMetadata(constants.decoratorsMetadata.columns, target) || [];

		if (!columns.map(column => column.propertyKey).includes(propertyKey)) {
			throw Error('Декоратор Boolean має асоціюватись з декоратором Column');
		}

		columns = columns.map(column => {
			if (column.propertyKey === propertyKey) {
				column.options.dataType = 'BOOLEAN';
			}

			return column;
		});

		Reflect.defineMetadata(constants.decoratorsMetadata.columns, columns, target);
	};
}
