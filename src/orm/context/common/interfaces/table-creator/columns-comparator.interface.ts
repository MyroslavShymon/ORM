import { ColumnInterface, ComputedColumnInterface } from '@core/interfaces';
import { ColumnPercentageInterface, ComputedColumnPercentageInterface } from '@context/common';

export interface ColumnsComparatorInterface {
	calculatePercentagesOfModifiedColumns(
		newColumns: ColumnInterface[],
		oldColumns: ColumnInterface[]
	): ColumnPercentageInterface[];

	calculatePercentagesOfModifiedComputedColumns(
		newComputedColumns: ComputedColumnInterface[],
		oldComputedColumns: ComputedColumnInterface[]
	): ComputedColumnPercentageInterface[];
}