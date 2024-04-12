import { PrimaryGeneratedColumnDecoratorInterface } from '@decorators/primary-generated-column/interfaces';
import { constants } from '@core/constants';

export function PrimaryGeneratedColumn(options?: PrimaryGeneratedColumnDecoratorInterface) {
	return function(target: any, propertyKey: string) {
		Reflect.defineMetadata(constants.decoratorsMetadata.primaryColumn, {
			isBigSerial: options?.isBigSerial || false,
			columnName: propertyKey
		}, target);
	};
}