import { IntegerDecoratorInterface } from '@decorators/types';
import { DecoratorCreator } from '@decorators/types/common/decorator-creator';

export function Integer(decoratorParams: IntegerDecoratorInterface) {
	return function(target: any, propertyKey: string) {
		DecoratorCreator.createBaseTypeDecorator(
			'Integer',
			target,
			propertyKey,
			decoratorParams
		);
	};
}