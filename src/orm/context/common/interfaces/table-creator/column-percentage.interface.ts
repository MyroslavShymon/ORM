import { ColumnInterface } from '@core/interfaces';

export interface ColumnPercentageInterface {
	newColumn: ColumnInterface,
	oldColumnName: string,
	oldColumnId: string,
	percentage: number
}