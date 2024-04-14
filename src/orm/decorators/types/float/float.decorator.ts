import { FloatDecoratorInterface } from '@decorators/types/float/common';
import { DecoratorCreator } from '@decorators/types/common/decorator-creator';

export function Float(decoratorParams: FloatDecoratorInterface) {
	return function(target: any, propertyKey: string) {
		DecoratorCreator.createBaseTypeDecorator(
			'Float',
			target,
			propertyKey,
			decoratorParams
		);
	};
}