import { ColumnInterface, ComputedColumnInterface, DataSourceInterface, TableIngotInterface } from '@core/interfaces';
import { DataSourcePostgres } from '@strategies/postgres';
import { ConstraintInterface, ForeignKeyInterface, TableOptionsPostgresqlInterface } from '@decorators/postgres';
import { TableOptionsMysqlInterface } from '@decorators/mysql';
import { TableComparatorInterface, TablePercentageInterface } from '@context/common';

export class TableComparator implements TableComparatorInterface {
	constructor() {
	}

	//TODO тут вказано чітко postgres, треба буде погратися з типами
	calculatePercentagesOfTablesWithModifiedState(
		newTables: TableIngotInterface<DataSourcePostgres>[],
		deletedTables: TableIngotInterface<DataSourcePostgres>[]
	): TablePercentageInterface[] {
		const tablesPercentage = [];

		for (const newTable of newTables) {
			for (const deletedTable of deletedTables) {
				const tablePercentage: TablePercentageInterface = {
					newTable,
					deletedTable,
					percentages: {}
				};

				if (newTable?.columns?.length && deletedTable?.columns?.length) {
					tablePercentage.percentages.columnsPercentage = this._calculateColumnPercentage(
						newTable.columns,
						deletedTable.columns,
						newTable?.primaryColumn?.columnName ? newTable.primaryColumn.columnName : null,
						deletedTable?.primaryColumn?.columnName ? deletedTable.primaryColumn.columnName : null
					);
				}

				if (newTable?.computedColumns?.length && deletedTable?.computedColumns?.length) {
					tablePercentage.percentages.computedColumnPercentage = this._calculateColumnPercentage(
						newTable?.computedColumns,
						deletedTable?.computedColumns
					);
				}

				if (newTable?.options?.unique?.length && deletedTable?.options?.unique?.length) {
					tablePercentage.percentages.optionsPercentage = this._calculateOptionsPercentage(
						newTable.options,
						deletedTable.options
					);
				}

				if (newTable?.options?.checkConstraint && deletedTable?.options?.checkConstraint) {
					tablePercentage.percentages.constraintsPercentage = this._calculateConstraintsPercentage(
						newTable.options.checkConstraint,
						deletedTable.options.checkConstraint
					);
				}

				if (newTable?.foreignKeys?.length && deletedTable?.foreignKeys?.length)
					tablePercentage.percentages.foreignKeyPercentage = this._calculateForeignKeysPercentage(
						newTable.foreignKeys,
						deletedTable.foreignKeys
					);

				if (newTable?.options?.primaryKeys?.length && deletedTable?.options?.primaryKeys?.length) {
					tablePercentage.percentages.primaryKeyPercentage = this._calculatePrimaryKeyPercentages(
						newTable.options.primaryKeys,
						deletedTable.options.primaryKeys
					);
				}

				tablesPercentage.push(tablePercentage);
			}
		}

		return tablesPercentage;
	}

	private _calculateOptionsPercentage(
		newTableOptions: DataSourceInterface extends DataSourcePostgres ? TableOptionsPostgresqlInterface : TableOptionsMysqlInterface,
		deletedTableOptions: DataSourceInterface extends DataSourcePostgres ? TableOptionsPostgresqlInterface : TableOptionsMysqlInterface
	): number {
		const flatten = (arr: string[] | string[][]): string[] => {
			if (Array.isArray(arr[0])) {
				return (arr as string[][]).reduce<string[]>((acc, val) => acc.concat(val), []);
			} else {
				return arr as string[];
			}
		};

		const flatUnique1 = flatten(newTableOptions.unique);
		const flatUnique2 = flatten(deletedTableOptions.unique);

		const uniqueIntersection = flatUnique1.filter(column => flatUnique2.includes(column));
		const uniqueUnion = Array.from(new Set([...flatUnique1, ...flatUnique2]));

		const overlapPercentage = (uniqueIntersection.length / uniqueUnion.length) * 100;

		return overlapPercentage;
	}

	private _calculateColumnPercentage(
		newTableColumns: ColumnInterface<DataSourceInterface>[] | ComputedColumnInterface<DataSourceInterface>[],
		deletedTableColumns: ColumnInterface<DataSourceInterface>[] | ComputedColumnInterface<DataSourceInterface>[],
		newTablePrimaryColumnName?: string,
		deletedTablePrimaryColumnName?: string
	): number {
		const newTableColumnsNames = newTableColumns.map(column => column.name);
		if (newTablePrimaryColumnName)
			newTableColumnsNames.push(newTablePrimaryColumnName);

		const deletedTableColumnsNames = deletedTableColumns.map(column => column.name);
		if (deletedTablePrimaryColumnName)
			deletedTableColumnsNames.push(deletedTablePrimaryColumnName);

		const commonColumns = newTableColumnsNames.filter(columnName => deletedTableColumnsNames.includes(columnName));

		const percentage = (commonColumns.length / deletedTableColumnsNames.length) * 100;
		if (!percentage) return 0;
		return percentage;
	}

	//TODO тут вказано чітко postgres, треба буде погратися з типами
	private _calculateConstraintsPercentage(
		newTableConstraints: ConstraintInterface | ConstraintInterface[],
		deletedTableConstraints: ConstraintInterface | ConstraintInterface[]
	): number {
		const getConstraintNames = (constraints: ConstraintInterface[] | ConstraintInterface): string[] => {
			if (Array.isArray(constraints)) {
				return constraints.map(constraint => constraint.name);
			} else if (constraints) {
				return [constraints.name];
			} else {
				return [];
			}
		};

		const newTableConstraintsNames = getConstraintNames(newTableConstraints);
		const deletedTableConstraintsNames = getConstraintNames(deletedTableConstraints);

		const commonConstraints = newTableConstraintsNames.filter(constraintName =>
			deletedTableConstraintsNames.some(names => names.includes(constraintName))
		);

		const percentage = (commonConstraints.length / deletedTableConstraintsNames.length) * 100;
		return percentage;
	}

	private _calculatePrimaryKeyPercentages(
		newTablePrimaryKeys: string[],
		deletedTablePrimaryKeys: string[]
	): number {
		const commonPrimaryKeys = newTablePrimaryKeys.filter(primaryKey => deletedTablePrimaryKeys.includes(primaryKey));

		const percentage = (commonPrimaryKeys.length / deletedTablePrimaryKeys.length) * 100;
		return percentage;
	}

	private _calculateForeignKeysPercentage(
		newTableForeignKeys: ForeignKeyInterface[],
		deletedTableForeignKeys: ForeignKeyInterface[]
	): number {
		const areForeignKeysEqual = (
			fk1: ForeignKeyInterface,
			fk2: ForeignKeyInterface
		): boolean => fk1.key === fk2.key && fk1.table === fk2.table && fk1.columnName === fk2.columnName;

		const hasForeignKey = (
			foreignKeys: ForeignKeyInterface[],
			targetKey: ForeignKeyInterface
		): boolean => foreignKeys.some(fk => areForeignKeysEqual(fk, targetKey));

		const commonForeignKeys = newTableForeignKeys.filter(fk =>
			hasForeignKey(deletedTableForeignKeys, fk)
		);

		const percentage = (commonForeignKeys.length / deletedTableForeignKeys.length) * 100;
		return percentage;
	}
}