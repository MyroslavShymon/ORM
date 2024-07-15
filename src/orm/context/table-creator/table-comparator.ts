import {
	ColumnInterface,
	ComputedColumnInterface,
	ConstraintInterface,
	ForeignKeyInterface,
	ManyToManyInterface,
	OneToManyInterface,
	OneToOneInterface,
	TableIngotInterface,
	TableOptionsInterface
} from '@core/interfaces';
import { TableComparatorInterface, TablePercentageInterface } from '@context/common';
import { DatabasesTypes } from '@core/enums';

export class TableComparator<DT extends DatabasesTypes> implements TableComparatorInterface<DT> {
	constructor() {
	}

	//TODO тут вказано чітко postgres, треба буде погратися з типами
	calculatePercentagesOfTablesWithModifiedState(
		newTables: TableIngotInterface<DT>[],
		deletedTables: TableIngotInterface<DT>[]
	): TablePercentageInterface<DT>[] {
		const tablesPercentage = [];

		for (const newTable of newTables) {
			for (const deletedTable of deletedTables) {
				const tablePercentage: TablePercentageInterface<DT> = {
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

				if (
					'checkConstraint' in newTable?.options &&
					'checkConstraint' in deletedTable?.options
				) {
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

				if (newTable?.oneToOne?.length && deletedTable?.oneToOne?.length) {
					tablePercentage.percentages.oneToOnePercentage = this._calculateOneToOnePercentage(
						newTable.oneToOne,
						deletedTable.oneToOne
					);
				}

				if (newTable?.oneToMany?.length && deletedTable?.oneToMany?.length) {
					tablePercentage.percentages.oneToManyPercentage = this._calculateOneToManyPercentage(
						newTable.oneToMany,
						deletedTable.oneToMany
					);
				}

				if (newTable?.manyToMany?.length && deletedTable?.manyToMany?.length) {
					tablePercentage.percentages.manyToManyPercentage = this._calculateManyToManyPercentage(
						newTable.manyToMany,
						deletedTable.manyToMany
					);
				}

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
		newTableOptions: TableOptionsInterface<DT>,
		deletedTableOptions: TableOptionsInterface<DT>
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
		newTableColumns: ColumnInterface<DT>[] | ComputedColumnInterface<DT>[],
		deletedTableColumns: ColumnInterface<DT>[] | ComputedColumnInterface<DT>[],
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

	private _calculateManyToManyPercentage(
		newTableManyToMany: ManyToManyInterface[],
		deleteTableManyToMany: ManyToManyInterface[]
	): number {
		const areManyToManyEqual = (
			m2m1: ManyToManyInterface,
			m2m2: ManyToManyInterface
		): boolean =>
			m2m1.foreignKey === m2m2.foreignKey &&
			m2m1.referencedTable === m2m2.referencedTable &&
			m2m1.referencedColumn === m2m2.referencedColumn &&
			m2m1.tableName === m2m2.tableName;

		const hasManyToMany = (
			manyToManys: ManyToManyInterface[],
			targetManyToMany: ManyToManyInterface
		): boolean => manyToManys.some(o2m => areManyToManyEqual(o2m, targetManyToMany));

		const commonManyToMany = newTableManyToMany.filter(o2m =>
			hasManyToMany(deleteTableManyToMany, o2m)
		);

		const percentage = (commonManyToMany.length / deleteTableManyToMany.length) * 100;
		return percentage;
	}

	private _calculateOneToManyPercentage(
		newTableOneToMany: OneToManyInterface[],
		deleteTableOneToMany: OneToManyInterface[]
	): number {
		const areOneToManyEqual = (
			o2m1: OneToManyInterface,
			o2m2: OneToManyInterface
		): boolean =>
			o2m1.foreignKey === o2m2.foreignKey &&
			o2m1.referenceColumn === o2m2.referenceColumn &&
			o2m1.tableName === o2m2.tableName;

		const hasOneToMany = (
			oneToManys: OneToManyInterface[],
			targetOneToMany: OneToManyInterface
		): boolean => oneToManys.some(o2m => areOneToManyEqual(o2m, targetOneToMany));

		const commonOneToMany = newTableOneToMany.filter(o2m =>
			hasOneToMany(deleteTableOneToMany, o2m)
		);

		const percentage = (commonOneToMany.length / deleteTableOneToMany.length) * 100;
		return percentage;
	}

	private _calculateOneToOnePercentage(
		newTableOneToOne: OneToOneInterface[],
		deletedTableOneToOne: OneToOneInterface[]
	): number {
		const areOneToOneEqual = (
			o2o1: OneToOneInterface,
			o2o2: OneToOneInterface
		): boolean =>
			o2o1.foreignKey === o2o2.foreignKey &&
			o2o1.table === o2o2.table &&
			o2o1.referenceColumn === o2o2.referenceColumn &&
			o2o1.columnName === o2o2.columnName;

		const hasOneToOne = (
			oneToOnes: OneToOneInterface[],
			targetOneToOne: OneToOneInterface
		): boolean => oneToOnes.some(o2o => areOneToOneEqual(o2o, targetOneToOne));

		const commonOneToOne = newTableOneToOne.filter(o2o =>
			hasOneToOne(deletedTableOneToOne, o2o)
		);

		const percentage = (commonOneToOne.length / deletedTableOneToOne.length) * 100;
		return percentage;
	}
}