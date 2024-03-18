import { DropTableInterface, RenameTableInterface } from '@core/interfaces';
import { BaseDatabaseStructureModifierInterface } from '@strategies/common';

export class BaseDatabaseStructureModifier implements BaseDatabaseStructureModifierInterface {
	renameTable(tableName: string, parameters: RenameTableInterface): string {
		return `ALTER TABLE public.${tableName} RENAME TO ${parameters.tableName};`;
	}

	dropTable(tableName: string, parameters: DropTableInterface): string {
		return `DROP TABLE ${parameters.ifExist ? 'IF EXISTS ' : ''}'${tableName}' ${parameters.type ? parameters.type : ''};`;
	}

}