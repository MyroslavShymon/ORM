import { ComputedColumnInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';

export interface ComputedColumnPercentageInterface<DT extends DatabasesTypes> {
	newColumn: ComputedColumnInterface<DT>,
	oldColumnName: string,
	oldColumnId: string,
	percentage: number
}