import { OneToManyDecoratorInterface } from '@decorators/relations/one-to-many/interfaces';
import { OneToManyInterface } from '@core/interfaces';
import { constants } from '@core/constants';

export function OneToMany({ referenceColumn, foreignKey }: OneToManyDecoratorInterface) {
	return function(target: any, propertyKey: string) {
		const oneToManyRelations: OneToManyInterface[] = Reflect.getMetadata(constants.decoratorsMetadata.oneToMany, target) || [];
		oneToManyRelations.push({ referenceColumn, foreignKey, tableName: propertyKey });
		Reflect.defineMetadata(constants.decoratorsMetadata.oneToMany, oneToManyRelations, target);
	};
}