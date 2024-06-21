import { v4 as uuidv4 } from 'uuid';
import {
	BaseColumnInterface,
	ColumnInterface,
	ComputedColumnInterface,
	DataSourceInterface,
	TableIngotInterface
} from '@core/interfaces';
import { constants } from '@core/constants';
import { TableComparator } from '@context/table-creator/table-comparator';
import {
	ColumnPercentageInterface,
	ComputedColumnPercentageInterface,
	TableCreationProcessorInterface
} from '@context/common';
import { ColumnsComparator } from '@context/table-creator/columns-comparator';

export class TableCreationProcessor implements TableCreationProcessorInterface {
	private readonly tableComparator = new TableComparator();
	private readonly columnsComparator = new ColumnsComparator();

	constructor() {
	}

	processingTablesWithModifiedState(
		potentiallyNewTables: TableIngotInterface<DataSourceInterface>[],
		potentiallyDeletedTables: TableIngotInterface<DataSourceInterface>[]
	): TableIngotInterface<DataSourceInterface>[] {
		const renamedTables: {
			table: TableIngotInterface<DataSourceInterface>
			model: TableIngotInterface<DataSourceInterface>
		}[] = [];
		const tablesWithPercentage = this.tableComparator.calculatePercentagesOfTablesWithModifiedState(potentiallyNewTables, potentiallyDeletedTables);
		console.log('tablesWithPercentatablesWithPercentagetablesWithPercentagege', tablesWithPercentage);

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

	processingNewTables(newTables: TableIngotInterface<DataSourceInterface>[])
		: TableIngotInterface<DataSourceInterface>[] {
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
		table: TableIngotInterface<DataSourceInterface>
		model: TableIngotInterface<DataSourceInterface>
	}[]): TableIngotInterface<DataSourceInterface>[] {
		const tablesForIngot = [];

		//processing tables with original names
		for (const { table, model } of potentialTables) {
			const id = table.id ? table.id : uuidv4();
			const name = model.name;
			const options = model.options;//TODO можливо потім будемо рефакторити options в table(якісь цікаві нові штуки туда добавим)
			const columns = this._handleColumns<ColumnInterface[]>(table.columns, model.columns);
			const computedColumns = this._handleColumns<ComputedColumnInterface[]>(table.computedColumns, model.computedColumns);
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

	//TODO тут шось дивне з типізацією, треба переглянути цей метод
	private _handleColumns<T extends ComputedColumnInterface[] | ColumnInterface[]>
	(tableColumns: T, modelColumns: T): ColumnInterface[] | ComputedColumnInterface[] {
		let columnsPercentage;
		let columns: (ColumnInterface | ComputedColumnInterface)[] = [];

		if (modelColumns == undefined || modelColumns.length === 0) {
			return columns;
		}

		if (tableColumns == undefined || tableColumns.length === 0) {
			return modelColumns.map(modelColumn => ({ id: uuidv4(), ...modelColumn }));
		}

		if (
			(modelColumns[0] as ComputedColumnInterface).calculate ||
			(modelColumns[0] as ComputedColumnInterface).stored
		) {
			columnsPercentage = this.columnsComparator.calculatePercentagesOfModifiedComputedColumns(
				modelColumns as ComputedColumnInterface[],
				tableColumns as ComputedColumnInterface[]
			);
		} else {
			columnsPercentage = this.columnsComparator.calculatePercentagesOfModifiedColumns(
				modelColumns as ColumnInterface[],
				tableColumns as ColumnInterface[]
			);
		}
		columnsPercentage = this._filterUniquePercentages(columnsPercentage);

		for (const columnPercentage of columnsPercentage) {
			if (columnPercentage.percentage >= constants.tableComparerAlgorithm.minimumColumnUniquePercentage) {
				columns.push({ id: columnPercentage.oldColumnId, ...columnPercentage.newColumn });
			}
		}

		//add columns with same names
		for (const modelColumn of modelColumns) {
			for (const tableColumn of tableColumns) {
				if (tableColumn.name === modelColumn.name) {
					const id = tableColumn.id ? tableColumn.id : uuidv4();
					columns.push({ id, ...modelColumn });
				}
			}
		}

		//add columns which new
		const resultModelColumns = (modelColumns as BaseColumnInterface[])
			.filter(
				modelColumn => !columns.some(column =>
					column.name === modelColumn.name
				))
			.map(
				column => ({ id: uuidv4(), ...column })
			);

		return [...columns, ...resultModelColumns];
	}

	private _filterUniquePercentages<T extends ColumnPercentageInterface | ComputedColumnPercentageInterface>
	(columnsPercentage: T[]): ColumnPercentageInterface[] {
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