import { TriggerInterface } from '@core/interfaces';
import { DropTriggerInterface } from '@core/interfaces/triggers-manager';
import { DatabasesTypes } from '@core/enums';
import { TriggerAltererInterface } from '@strategies/postgres';

export class TriggerAlterer implements TriggerAltererInterface {
	createTrigger(trigger: TriggerInterface<DatabasesTypes.POSTGRES>): string {
		return `
			  CREATE OR REPLACE FUNCTION ${trigger.triggerFunctionName}()
			  RETURNS TRIGGER AS $$
			  BEGIN
			   ${trigger.triggerFunction}
			  END;
			  $$ LANGUAGE plpgsql;
		
			  CREATE TRIGGER ${trigger.name}
			  ${trigger.timing} ${trigger.event} ON ${trigger.tableName}
			  FOR EACH ROW
			  EXECUTE FUNCTION ${trigger.triggerFunctionName}();
	 ` + '\n';
	}

	dropTrigger(parameters: DropTriggerInterface<DatabasesTypes.POSTGRES>): string {
		return `DROP TRIGGER IF EXISTS ${parameters.triggerName} ON ${parameters.tableName};` + '\n';
	}
}