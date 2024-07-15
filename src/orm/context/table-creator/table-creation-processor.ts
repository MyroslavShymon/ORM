import { v4 as uuidv4 } from 'uuid';
import { ColumnInterface, ComputedColumnInterface, TableIngotInterface } from '@core/interfaces';
import { constants } from '@core/constants';
import { TableComparator } from '@context/table-creator/table-comparator';
import {
	ColumnPercentageInterface,
	ComputedColumnPercentageInterface,
	TableCreationProcessorInterface
} from '@context/common';
import { ColumnsComparator } from '@context/table-creator/columns-comparator';
import { DatabasesTypes } from '@core/enums';

export class TableCreationProcessor<DT extends DatabasesTypes> implements TableCreationProcessorInterface<DT> {
	private readonly tableComparator = new TableComparator();
	private readonly columnsComparator = new ColumnsComparator();

	constructor() {
	}

	processingTablesWithModifiedState(
		potentiallyNewTables: TableIngotInterface<DT>[],
		potentiallyDeletedTables: TableIngotInterface<DT>[]
	): TableIngotInterface<DT>[] {
		const renamedTables: {
			table: TableIngotInterface<DT>
			model: TableIngotInterface<DT>
		}[] = [];
		const tablesWithPercentage = this.tableComparator.calculatePercentagesOfTablesWithModifiedState(potentiallyNewTables, potentiallyDeletedTables);

		for (const tableWithPercentage of tablesWithPercentage) {
			if (!tableWithPercentage.percentages.columnsPercentage) {
				continue;
			}

			let totalPercentage = tableWithPercentage.percentages.columnsPercentage;
			const otherPercentages = Object.entries(tableWithPercentage.percentages).filter(entry => entry[0] != 'columnsPercentage');
			const countOfConditions = otherPercentages.length;

			if (totalPercentage > constants.tableComparerAlgorithm.minimumUniquesPercentage) {
				renamedTables.push({
					table: tableWithPercentage.deletedTable,
					model: tableWithPercentage.newTable
				});
				continue;
			}

			if (countOfConditions === 0) {
				continue;
			}

			const percentageForOneCondition = (constants.tableComparerAlgorithm.maximumConvergenceOfTable - totalPercentage) / countOfConditions;

			for (const percentageForCondition of otherPercentages) {
				totalPercentage += (percentageForOneCondition * percentageForCondition[1]) / 100;
			}

			if (totalPercentage > constants.tableComparerAlgorithm.minimumUniquesPercentage) {
				renamedTables.push({
					table: tableWithPercentage.deletedTable,
					model: tableWithPercentage.newTable
				});
			}
		}

		const newTables = potentiallyNewTables
			.filter(potentialNewTable => !renamedTables
				.some(renamedTable =>
					renamedTable.model.name === potentialNewTable.name
				)
			);

		return [
			...this.processingOriginalTables(renamedTables),
			...this.processingNewTables(newTables)
		];
	}

	processingNewTables(newTables: TableIngotInterface<DT>[])
		: TableIngotInterface<DT>[] {
		return newTables.map(newTable => {
			const { columns, computedColumns, ...otherTableParams } = newTable;

			const modifiedColumns = columns.map(column => ({ id: uuidv4(), ...column }));
			const modifiedComputedColumns = computedColumns.map(computedColumn => ({ id: uuidv4(), ...computedColumn }));

			return {
				id: uuidv4(),
				columns: modifiedColumns,
				computedColumns: modifiedComputedColumns,
				...otherTableParams
			};
		});
	}

	processingOriginalTables(potentialTables: {
		table: TableIngotInterface<DT>
		model: TableIngotInterface<DT>
	}[]): TableIngotInterface<DT>[] {
		const tablesForIngot = [];

		//processing tables with original names
		for (const { table, model } of potentialTables) {
			const id = table.id ? table.id : uuidv4();
			const name = model.name;
			const options = model.options;//TODO можливо потім будемо рефакторити options в table(якісь цікаві нові штуки туда добавим)
			const columns = this._handleColumns(table.columns, model.columns, this.columnsComparator.calculatePercentagesOfModifiedColumns.bind(this.columnsComparator));
			const computedColumns = this._handleColumns(table.computedColumns, model.computedColumns, this.columnsComparator.calculatePercentagesOfModifiedComputedColumns.bind(this.columnsComparator));
			const foreignKeys = model.foreignKeys;//TODO подумати над тим чи foreignKeys мають бути з Id чи ні\
			const oneToOne = model.oneToOne;
			const oneToMany = model.oneToMany;
			const manyToMany = model.manyToMany;
			const primaryColumn = model.primaryColumn;

			tablesForIngot.push({
				id,
				name,
				options,
				columns,
				computedColumns,
				foreignKeys,
				oneToOne,
				oneToMany,
				manyToMany,
				primaryColumn
			});
		}

		return tablesForIngot;
	}

	private _handleColumns<T extends ColumnInterface<DT> | ComputedColumnInterface<DT>>(
		tableColumns: T[],
		modelColumns: T[],
		calculatePercentagesOfModifiedColumns: (modelColumns: T[], tableColumns: T[]) => ColumnPercentageInterface<DT>[]
	): T[] {
		let columnsPercentage;
		let columns: T[] = [];

		if (modelColumns == undefined || modelColumns.length === 0) {
			return columns;
		}

		if (tableColumns == undefined || tableColumns.length === 0) {
			return modelColumns.map(modelColumn => ({ id: uuidv4(), ...modelColumn }));
		}

		// Додаємо колонки з однаковими іменами
		for (const modelColumn of modelColumns) {
			for (const tableColumn of tableColumns) {
				if (tableColumn.name === modelColumn.name) {
					const id = tableColumn.id ? tableColumn.id : uuidv4();
					columns.push({ id, ...modelColumn });
				}
			}
		}

		columnsPercentage = calculatePercentagesOfModifiedColumns(modelColumns, tableColumns);

		columnsPercentage = this._filterUniquePercentages(columnsPercentage);

		for (const columnPercentage of columnsPercentage) {
			if (columnPercentage.percentage >= constants.tableComparerAlgorithm.minimumColumnUniquePercentage) {
				columns.push({ id: columnPercentage.oldColumnId, ...columnPercentage.newColumn });
			}
		}

		// Додаємо нові колонки
		const resultModelColumns = modelColumns
			.filter(
				modelColumn => !columns.some(column =>
					column.name === modelColumn.name
				))
			.map(
				column => ({ id: uuidv4(), ...column })
			);

		return [...columns, ...resultModelColumns];
	}

	private _filterUniquePercentages<T extends ColumnPercentageInterface<DT> | ComputedColumnPercentageInterface<DT>>
	(columnsPercentage: T[]): (ColumnPercentageInterface<DT> | ComputedColumnPercentageInterface<DT>)[] {
		// Крок 1: Визначити елементи, які містять newColumn.name, що з'являються більше одного разу
		const nameCount = new Map();
		columnsPercentage.forEach(item => {
			const name = item.newColumn.name;
			nameCount.set(name, (nameCount.get(name) || 0) + 1);
		});

		const repeatedNames = new Set();
		nameCount.forEach((count, name) => {
			if (count > 1) {
				repeatedNames.add(name);
			}
		});

		// Крок 2: Фільтрувати всі елементи, які мають збіг за oldColumnName
		const oldNameCount = new Map();
		columnsPercentage.forEach(item => {
			const oldName = item.oldColumnName;
			oldNameCount.set(oldName, (oldNameCount.get(oldName) || 0) + 1);
		});

		const repeatedOldNames = new Set();
		oldNameCount.forEach((count, oldName) => {
			if (count > 1) {
				repeatedOldNames.add(oldName);
			}
		});

		// Крок 3: Вибір елементів, що повторюються
		const intermediateArray = [];
		const processedNames = new Set();
		const processedOldNames = new Set();

		columnsPercentage.forEach(item => {
			const name = item.newColumn.name;
			const oldName = item.oldColumnName;
			if (repeatedNames.has(name) || repeatedOldNames.has(oldName)) {
				if (!processedNames.has(name) && !processedOldNames.has(oldName)) {
					intermediateArray.push(item);
					processedNames.add(name);
					processedOldNames.add(oldName);
				}
			} else {
				intermediateArray.push(item);
			}
		});

		return intermediateArray;
	}
}