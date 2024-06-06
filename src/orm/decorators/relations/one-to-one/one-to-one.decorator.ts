import { constants } from '@core/constants';
import { OneToOneDecoratorInterface } from '@decorators/relations/one-to-one/interfaces';
import { OneToOneInterface } from '@core/interfaces';

export function OneToOne({ table, foreignKey, referenceColumn }: OneToOneDecoratorInterface) {
	return function(target: any, propertyKey: string) {
		const oneToOneRelations: OneToOneInterface[] = Reflect.getMetadata(constants.decoratorsMetadata.oneToOne, target) || [];
		oneToOneRelations.push({ table, foreignKey, referenceColumn, columnName: propertyKey });
		Reflect.defineMetadata(constants.decoratorsMetadata.oneToOne, oneToOneRelations, target);
	};
}