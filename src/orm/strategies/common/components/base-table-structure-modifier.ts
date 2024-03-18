import { AddDefaultValueInterface, DropDefaultValueInterface, RenameColumnInterface } from '@core/interfaces';
import { BaseTableStructureModifierInterface } from '@strategies/common';

export class BaseTableStructureModifier implements BaseTableStructureModifierInterface {
	addDefaultValue(tableName: string, parameters: AddDefaultValueInterface): string {
		return `ALTER TABLE ${tableName} ALTER COLUMN ${parameters.columnName} SET DEFAULT '${parameters.value}';`;
	}

	dropDefaultValue(tableName: string, parameters: DropDefaultValueInterface): string {
		return `ALTER TABLE ${tableName} ALTER COLUMN ${parameters.columnName} DROP DEFAULT;`;
	}

	renameColumn(tableName: string, parameters: RenameColumnInterface): string {
		return `ALTER TABLE ${tableName} RENAME COLUMN ${parameters.columnName} TO '${parameters.futureColumnName}';`;
	}

}