import { DecoratorCreator, NumericDecoratorInterface } from '@decorators/types';

export function Numeric(decoratorParams: NumericDecoratorInterface) {
	return function(target: any, propertyKey: string) {
		DecoratorCreator.createBaseTypeDecorator(
			'Numeric',
			target,
			propertyKey,
			decoratorParams
		);
	};
}