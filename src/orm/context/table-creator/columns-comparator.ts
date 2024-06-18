import { ColumnInterface } from '@core/interfaces';
import { ColumnPercentageInterface, ColumnsComparatorInterface } from '@context/common';

export class ColumnsComparator implements ColumnsComparatorInterface {
	constructor() {
	}

	calculatePercentagesOfModifiedColumns(
		newColumns: ColumnInterface[],
		oldColumns: ColumnInterface[]
	): ColumnPercentageInterface[] {
		const columnsPercentage: ColumnPercentageInterface[] = [];

		const mismatchedColumns = newColumns.filter(newColumn => !oldColumns.find(oldColumn => oldColumn.name === newColumn.name));

		for (const mismatchedColumn of mismatchedColumns) {
			for (const oldColumn of oldColumns) {
				if (mismatchedColumn.name !== oldColumn.name) {
					let totalFields = 0;
					let matchingFields = 0;
					Object.entries(mismatchedColumn.options).forEach(([field, value]) => {
						totalFields++;
						if (value === oldColumn.options[field]) {
							matchingFields++;
						}
					});
					columnsPercentage.push({
						newColumn: mismatchedColumn,
						oldColumnName: oldColumn.name,
						oldColumnId: oldColumn.id,
						percentage: (matchingFields / totalFields) * 100
					});
				}
			}
		}

		return columnsPercentage;
	}
}