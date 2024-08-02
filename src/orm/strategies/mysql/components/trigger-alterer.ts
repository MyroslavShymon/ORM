import { TriggerInterface } from '@core/interfaces';
import { DropTriggerInterface } from '@core/interfaces/triggers-manager';
import { DatabasesTypes } from '@core/enums';
import { TriggerAltererInterface } from '@strategies/mysql';

export class TriggerAlterer implements TriggerAltererInterface {
	createTrigger(trigger: TriggerInterface<DatabasesTypes.MYSQL>): string {
		return `
		   CREATE TRIGGER ${trigger.name}
		   ${trigger.timing} ${trigger.event} ON ${trigger.tableName}
		   FOR EACH ROW
		   BEGIN
			${trigger.function}
		   END;
	 `;
	}

	dropTrigger(parameters: DropTriggerInterface<DatabasesTypes.MYSQL>): string {
		return `DROP TRIGGER IF EXISTS ${parameters.triggerName};`;
	}
}