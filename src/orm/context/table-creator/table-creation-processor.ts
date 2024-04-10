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
import { TableCreationProcessorInterface } from '@context/common';

export class TableCreationProcessor implements TableCreationProcessorInterface {
	private readonly tableComparator = new TableComparator();

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
			const foreignKeys = model.foreignKeys;//TODO подумати над тим чи foreignKeys мають бути з Id чи ні
			const primaryColumn = model.primaryColumn;

			tablesForIngot.push({ id, name, options, columns, computedColumns, foreignKeys, primaryColumn });
		}

		return tablesForIngot;
	}

	//TODO тут шось дивне з типізацією, треба переглянути цей метод
	private _handleColumns<T extends BaseColumnInterface[]>
	(tableColumns: T, modelColumns: T): ColumnInterface[] | ComputedColumnInterface[] {
		let columns: (ColumnInterface | ComputedColumnInterface)[] = [];

		if (modelColumns == undefined || modelColumns.length === 0) {
			return columns;
		}

		if (tableColumns == undefined || tableColumns.length === 0) {
			return modelColumns.map(modelColumn => ({ id: uuidv4(), ...modelColumn }));
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
}