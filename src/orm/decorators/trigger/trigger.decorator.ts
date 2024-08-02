import 'reflect-metadata';
import { TriggerDecoratorInterface, TriggerMetadataInterface } from '@decorators/trigger/interfaces';
import { constants } from '@core/constants';

export function Trigger(decoratorParams: TriggerDecoratorInterface) {
	return function(constructor: Function) {
		let tableName = decoratorParams.tableName || constructor.name;
		let triggers: TriggerMetadataInterface[] = Reflect.getMetadata(constants.decoratorsMetadata.triggers, constructor.prototype) || [];
		if (!decoratorParams.function) {
			if (!decoratorParams.functionName || !decoratorParams.functions) {
				throw Error('Ви не вказали функцію або не вказали імені для функції або не вказали клас з функціями!');
			}

			if (decoratorParams.functions) {
				decoratorParams.function = getFunction(decoratorParams);
			}
		}

		const { name, event, timing, triggerFunctionName } = decoratorParams;

		triggers = removeExistingTrigger(triggers, decoratorParams, tableName);

		triggers.push({
			name,
			event,
			tableName,
			timing,
			triggerFunctionName,
			function: decoratorParams.function
		});
		Reflect.defineMetadata(constants.decoratorsMetadata.triggers, triggers, constructor.prototype);
	};
}

function getFunction(decoratorParams: TriggerDecoratorInterface): string {
	const functions = new decoratorParams.functions();

	const prototype = Object.getPrototypeOf(functions);
	const methodNames = Object.getOwnPropertyNames(prototype).filter(name => name !== 'constructor' && typeof prototype[name] === 'function');
	const foundedFunctionName = methodNames.find(methodName => methodName === decoratorParams.functionName);

	if (!foundedFunctionName) {
		throw Error('Ви не вказали функцію для тригера!');
	}

	return functions[foundedFunctionName]();
}

function removeExistingTrigger(triggers: TriggerMetadataInterface[], decoratorParams: TriggerDecoratorInterface, tableName: string): TriggerMetadataInterface[] {
	return triggers.filter(trigger =>
		!(trigger.name === decoratorParams.name &&
			trigger.event === decoratorParams.event &&
			trigger.timing === decoratorParams.timing &&
			trigger.tableName === tableName)
	);
}