import { DecoratorCreator, IntegerDecoratorInterface } from '@decorators/types';

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