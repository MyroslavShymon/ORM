import { constants } from '@core/constants';
import { ManyToManyDecoratorInterface } from '@decorators/relations/many-to-many/interfaces';
import { ManyToManyInterface } from '@core/interfaces';

export function ManyToMany({ tableName, foreignKey, referencedColumn }: ManyToManyDecoratorInterface) {
	return function(target: any, propertyKey: string) {
		const oneToManyRelations: ManyToManyInterface[] = Reflect.getMetadata(constants.decoratorsMetadata.manyToMany, target) || [];
		oneToManyRelations.push({ foreignKey, tableName, referencedColumn, referencedTable: propertyKey });
		Reflect.defineMetadata(constants.decoratorsMetadata.manyToMany, oneToManyRelations, target);
	};
}