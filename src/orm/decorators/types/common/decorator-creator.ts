import { ColumnMetadataInterface } from '@decorators/column';
import { constants } from '@core/constants';
import { FloatDecoratorInterface, IntegerDecoratorInterface } from '@decorators/types';

export class DecoratorCreator {
	static createBaseTypeDecorator<T extends IntegerDecoratorInterface | FloatDecoratorInterface>
	(name: string, target: any, propertyKey: string, { type, ...otherOptions }: T) {
		let columns: ColumnMetadataInterface[] = Reflect.getMetadata(constants.decoratorsMetadata.columns, target) || [];

		if (!columns.map(column => column.propertyKey).includes(propertyKey)) {
			throw Error(`Декоратор ${name} має асоціюватись з декоратором Column`);
		}

		columns = columns.map(column => {
			if (column.propertyKey === propertyKey) {
				column.options.dataType = type;
				column.options = { ...column.options, ...otherOptions };
			}

			return column;
		});

		Reflect.defineMetadata(constants.decoratorsMetadata.columns, columns, target);
	}
}