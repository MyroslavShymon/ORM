import { AddDefaultValueInterface, DropDefaultValueInterface, RenameColumnInterface } from '@core/interfaces';

export interface BaseTableStructureModifierInterface {
	addDefaultValue(tableName: string, parameters: AddDefaultValueInterface): string;

	dropDefaultValue(tableName: string, parameters: DropDefaultValueInterface): string;

	renameColumn(tableName: string, parameters: RenameColumnInterface): string;
}