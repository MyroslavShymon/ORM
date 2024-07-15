import { ColumnInterface, ComputedColumnInterface } from '@core/interfaces';
import { ColumnPercentageInterface, ComputedColumnPercentageInterface } from '@context/common';
import { DatabasesTypes } from '@core/enums';

export interface ColumnsComparatorInterface<DT extends DatabasesTypes> {
	calculatePercentagesOfModifiedColumns(
		newColumns: ColumnInterface<DT>[],
		oldColumns: ColumnInterface<DT>[]
	): ColumnPercentageInterface<DT>[];

	calculatePercentagesOfModifiedComputedColumns(
		newComputedColumns: ComputedColumnInterface<DT>[],
		oldComputedColumns: ComputedColumnInterface<DT>[]
	): ComputedColumnPercentageInterface<DT>[];
}