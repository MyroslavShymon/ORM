import { ComputedColumnInterface } from '@core/interfaces';

export interface ComputedColumnPercentageInterface {
	newColumn: ComputedColumnInterface,
	oldColumnName: string,
	oldColumnId: string,
	percentage: number
}