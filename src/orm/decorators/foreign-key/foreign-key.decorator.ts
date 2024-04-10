import { ForeignKeyDecoratorInterface } from '@decorators/foreign-key/interfaces';
import { ForeignKeyInterface } from '@core/interfaces';

export function ForeignKey({ key, table }: ForeignKeyDecoratorInterface) {
	return function(target: any, propertyKey: string) {
		const foreignKeys: ForeignKeyInterface[] = Reflect.getMetadata('foreign-keys', target) || [];
		foreignKeys.push({ key, table, columnName: propertyKey });
		Reflect.defineMetadata('foreign-keys', foreignKeys, target);
	};
}