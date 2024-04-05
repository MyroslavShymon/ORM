import { PrimaryGeneratedColumnDecoratorInterface } from '@decorators/primary-generated-column/interfaces';

export function PrimaryGeneratedColumn(options?: PrimaryGeneratedColumnDecoratorInterface) {
	return function(target: any, propertyKey: string) {
		Reflect.defineMetadata('primary-column', {
			isBigSerial: options?.isBigSerial || false,
			columnName: propertyKey
		}, target);
	};
}