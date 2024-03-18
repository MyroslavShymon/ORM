import { DropTableInterface, RenameTableInterface } from '@core/interfaces';

export interface BaseDatabaseStructureModifierInterface {
	renameTable(tableName: string, parameters: RenameTableInterface): string;

	dropTable(tableName: string, parameters: DropTableInterface): string;
}