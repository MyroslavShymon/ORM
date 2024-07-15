import { ColumnInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';

export interface ColumnPercentageInterface<DT extends DatabasesTypes> {
	newColumn: ColumnInterface<DT>,
	oldColumnName: string,
	oldColumnId: string,
	percentage: number
}