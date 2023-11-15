import { AddColumnInterface } from '../../../../interfaces';

export interface TableAltererInterface {
	addColumn(tableName: string, parameters: AddColumnInterface): string;
}