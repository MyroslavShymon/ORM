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

		const getUniqueColumnsInNewColumns = this._getUniqueColumns(newColumns, oldColumns);
		const getUniqueColumnsInOldColumns = this._getUniqueColumns(oldColumns, newColumns);

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

		console.log('columnsPercentage', columnsPercentage);

		return columnsPercentage;
	}
	
	private _getUniqueColumns(
		newColumns: ColumnInterface[],
		oldColumns: ColumnInterface[]
	): ColumnInterface[] {
		const namesSet2 = new Set(oldColumns.map(obj => obj.name));

		const uniqueObjects = newColumns.filter(obj => !namesSet2.has(obj.name));

		return uniqueObjects;
	}
}