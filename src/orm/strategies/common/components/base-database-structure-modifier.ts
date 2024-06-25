import { RenameTableInterface } from '@core/interfaces';
import { BaseDatabaseStructureModifierInterface } from '@strategies/common';

export class BaseDatabaseStructureModifier implements BaseDatabaseStructureModifierInterface {
	renameTable(tableName: string, parameters: RenameTableInterface): string {
		return `ALTER TABLE public.${tableName} RENAME TO ${parameters.tableName};`;
	}
}