import { ForeignKeyDecoratorInterface } from '@decorators/foreign-key/interfaces';
import { ForeignKeyInterface } from '@core/interfaces';
import { constants } from '@core/constants';

export function ForeignKey({ key, table }: ForeignKeyDecoratorInterface) {
	return function(target: any, propertyKey: string) {
		const foreignKeys: ForeignKeyInterface[] = Reflect.getMetadata('foreign-keys', target) || [];
		foreignKeys.push({ key, table, columnName: propertyKey });
		Reflect.defineMetadata(constants.decoratorsMetadata.foreignKeys, foreignKeys, target);
	};
}