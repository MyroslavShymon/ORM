import { RenameTableInterface } from '@core/interfaces';

export interface BaseDatabaseStructureModifierInterface {
	renameTable(tableName: string, parameters: RenameTableInterface): string;
}