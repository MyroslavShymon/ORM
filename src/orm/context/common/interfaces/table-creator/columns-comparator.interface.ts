import { ColumnInterface } from '@core/interfaces';
import { ColumnPercentageInterface } from '@context/common';

export interface ColumnsComparatorInterface {
	calculatePercentagesOfModifiedColumns(
		newColumns: ColumnInterface[],
		oldColumns: ColumnInterface[]
	): ColumnPercentageInterface[];
}