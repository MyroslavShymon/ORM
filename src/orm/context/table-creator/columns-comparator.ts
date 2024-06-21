import { ColumnInterface, ComputedColumnInterface } from '@core/interfaces';
import {
	ColumnPercentageInterface,
	ColumnsComparatorInterface,
	ComputedColumnPercentageInterface
} from '@context/common';

export class ColumnsComparator implements ColumnsComparatorInterface {
	constructor() {
	}

	calculatePercentagesOfModifiedComputedColumns(
		newComputedColumns: ComputedColumnInterface[],
		oldComputedColumns: ComputedColumnInterface[]
	): ComputedColumnPercentageInterface[] {
		const computedColumnsPercentage: ComputedColumnPercentageInterface[] = [];

		const getUniqueComputedColumnsInNewColumns = this._getUniqueColumns<ComputedColumnInterface>(newComputedColumns, oldComputedColumns);
		const getUniqueComputedColumnsInOldColumns = this._getUniqueColumns<ComputedColumnInterface>(oldComputedColumns, newComputedColumns);

		if (!getUniqueComputedColumnsInNewColumns.length || !getUniqueComputedColumnsInOldColumns.length) {
			return [];
		}

		for (const newComputedColumn of getUniqueComputedColumnsInNewColumns) {
			for (const oldComputedColumn of getUniqueComputedColumnsInOldColumns) {
				let totalFields = 0;
				let matchingFields = 0;
				const { id, name, ...options } = newComputedColumn;
				Object.entries(options).forEach(([field, value]) => {
					totalFields++;
					if (value === oldComputedColumn[field]) {
						matchingFields++;
					}
				});
				computedColumnsPercentage.push({
					newColumn: newComputedColumn,
					oldColumnName: oldComputedColumn.name,
					oldColumnId: oldComputedColumn.id,
					percentage: (matchingFields / totalFields) * 100
				});
			}
		}

		return computedColumnsPercentage;
	}

	calculatePercentagesOfModifiedColumns(
		newColumns: ColumnInterface[],
		oldColumns: ColumnInterface[]
	): ColumnPercentageInterface[] {
		const columnsPercentage: ColumnPercentageInterface[] = [];

		const getUniqueColumnsInNewColumns = this._getUniqueColumns<ColumnInterface>(newColumns, oldColumns);
		const getUniqueColumnsInOldColumns = this._getUniqueColumns<ColumnInterface>(oldColumns, newColumns);

		if (!getUniqueColumnsInNewColumns.length || !getUniqueColumnsInOldColumns.length) {
			return [];
		}

		for (const newColumn of getUniqueColumnsInNewColumns) {
			for (const oldColumn of getUniqueColumnsInOldColumns) {
				let totalFields = 0;
				let matchingFields = 0;
				Object.entries(newColumn.options).forEach(([field, value]) => {
					totalFields++;
					if (value === oldColumn.options[field]) {
						matchingFields++;
					}
				});
				columnsPercentage.push({
					newColumn: newColumn,
					oldColumnName: oldColumn.name,
					oldColumnId: oldColumn.id,
					percentage: (matchingFields / totalFields) * 100
				});
			}
		}

		return columnsPercentage;
	}

	private _getUniqueColumns<T extends ColumnInterface | ComputedColumnInterface>
	(newColumns: T[], oldColumns: T[]): T[] {
		const namesSet2 = new Set(oldColumns.map(obj => obj.name));

		const uniqueObjects = newColumns.filter(obj => !namesSet2.has(obj.name));

		return uniqueObjects;
	}
}