import { v4 as uuidv4 } from 'uuid';
import { TableCreatorInterface } from '@context/interfaces';
import { ColumnInterface, ComputedColumnInterface, DataSourceInterface, TableInterface } from '@core/interfaces';
import {
	ComputedColumnMetadataInterface,
	ConstraintInterface,
	ForeignKeyInterface,
	PrimaryGeneratedColumnInterface,
	TableOptionsPostgresqlInterface
} from '@decorators/postgres';
import { TableIngotInterface } from '@core/interfaces/table-ingot.interface';
import { constants } from '@core/constants';
import { ConnectionData } from '@core/types';
import { DataSourcePostgres } from '@strategies/postgres';
import { TableOptionsMysqlInterface } from '@decorators/mysql';

// type gdf = 'postgres' | 'mysql' | 'sqlserver'
// const c: { c: gdf } = { c: 'mysql' };
// type PostgresTypes = { a: '' }
// type MySqlTypes = { b: '' }
// type SqlServerTypes = { c: '' }
//
// type DatabaseTypes<T extends string> = T extends 'postgres' ? PostgresTypes :
// 	T extends 'mysql' ? MySqlTypes :
// 		T extends 'sqlserver' ? SqlServerTypes :
// 			/* інші варіанти */ any;
//
// // Приклад використання:
// const databaseType: gdf = c.c/* отримане значення */;
// type MyDatabaseType = DatabaseTypes<typeof databaseType>;
// const tt: MyDatabaseType = {};

// type PostgresTypes = /* ваш тип для PostgreSQL */;
// type MySqlTypes = /* ваш тип для MySQL */;
// type SqlServerTypes = /* ваш тип для Microsoft SQL Server */;
//
// type DatabaseTypes<T extends string> = T extends 'postgres' ? PostgresTypes :
// 	T extends 'mysql' ? MySqlTypes :
// 		T extends 'sqlserver' ? SqlServerTypes :
// 			/* інші варіанти */ any;
//
// // Приклад використання:
// const databaseType: 'postgres' | 'mysql' | 'sqlserver' = /* отримане значення */;
// type MyDatabaseType = DatabaseTypes<typeof databaseType>;

export class TableCreator implements TableCreatorInterface {
	private readonly _dataSource: DataSourceInterface;

	constructor(dataSource: DataSourceInterface) {
		this._dataSource = dataSource;
	}

	async createIngotOfTables({
								  models,
								  migrationTable = constants.migrationsTableName,
								  migrationTableSchema = constants.migrationsTableSchemaName
							  }: ConnectionData): Promise<TableIngotInterface<DataSourceInterface>[]> {
		let currentTablesIngot: TableIngotInterface<DataSourceInterface>[] = [];
		let potentialModels = [];

		const currentDatabaseIngot = await this._dataSource.migrationService.getCurrentDatabaseIngot(
			this._dataSource,
			migrationTable,
			migrationTableSchema
		);

		if (currentDatabaseIngot.tables) {
			currentTablesIngot = currentDatabaseIngot.tables;
		}

		//preparing of models
		for (let model of models) {
			const table: TableInterface<DataSourceInterface>
				= Reflect.getMetadata('table', model.prototype);
			const metadataColumns
				= Reflect.getMetadata('columns', model.prototype);
			const metadataComputedColumns: ComputedColumnMetadataInterface[]
				= Reflect.getMetadata('computed-columns', model.prototype);
			const foreignKeys: ForeignKeyInterface[]
				= Reflect.getMetadata('foreign-keys', model.prototype);
			const primaryColumn: PrimaryGeneratedColumnInterface
				= Reflect.getMetadata('primary-column', model.prototype);
			console.log('primaryColumn', primaryColumn);

			let columns = [];
			if (metadataColumns) {
				columns = metadataColumns.map(metadataColumn => {
					const { propertyKey, ...column } = metadataColumn;
					return column;
				});

				columns = columns.map(column => ({ ...column }));
			}

			let computedColumns = [];
			if (metadataComputedColumns) {
				computedColumns = metadataComputedColumns.map(metadataColumn => {
					const { propertyKey, ...column } = metadataColumn;
					return column;
				});

				computedColumns = computedColumns.map(computedColumn => ({ ...computedColumn }));
			}

			const potentialModel: TableIngotInterface<DataSourceInterface> = {
				...table,
				columns,
				computedColumns,
				foreignKeys,
				primaryColumn
			};

			potentialModels.push(potentialModel);


			// // {TODO тут лишається undefined тому не ясно як з цим далі треба буде працювати
			// // 	name: 'product',
			// // 	options: undefined,
			// // 	columns: [Array],
			// // 	computedColumns: undefined
			// // }
			//
			// //логіка додавання злитків в бд
			// if (tablesIngot.length === 0) {
			// 	tablesIngot.push({ id: uuidv4(), ...table, columns, computedColumns, foreignKeys, primaryColumn });
			// }
			//
			// if (tablesIngot.length !== 0) {
			// 	const existingTableIndex = tablesIngot.findIndex(currentTable => currentTable.name === table.name);
			//
			// 	if (existingTableIndex === -1) {
			// 		// if (columns.length !== tableIngot.columns.length) {
			// 		//
			// 		// }
			// 		//тут треба зробити перевірку чи це не просто змінена таблиця
			// 		//перевірити чи існують ті самі колонки
			//
			// 		// tablesIngot.forEach(currentTable => {
			// 		// 	const currentTableColumns = currentTable.columns.map(column => ({
			// 		// 		name: column.name,
			// 		// 		type: column.options.dataType
			// 		// 	}));
			// 		// 	columns.
			// 		// });
			// 		tablesIngot.push({
			// 			id: uuidv4(),
			// 			...table,
			// 			columns,
			// 			computedColumns,
			// 			foreignKeys,
			// 			primaryColumn
			// 		});
			// 	}
			// }
			//
			// //логіка видалення таблиці зі злитка в бд
			// tablesIngot = tablesIngot.filter(currentTable =>
			// 	models.some(model => Reflect.getMetadata('table', model.prototype).name === currentTable.name)
			// );
		}

		const databaseState: {
			tablesWithOriginalNames: {
				table: TableIngotInterface<DataSourceInterface>
				model: TableIngotInterface<DataSourceInterface>
			}[],
			tablesWithModifiedState: {
				potentiallyDeletedTables: TableIngotInterface<DataSourceInterface>[],
				potentiallyNewTables: TableIngotInterface<DataSourceInterface>[]
			}
		} = {
			tablesWithOriginalNames: [],
			tablesWithModifiedState: {
				potentiallyDeletedTables: [],
				potentiallyNewTables: []
			}
		};

		//get tables with original names
		for (const model of potentialModels) {
			for (const table of currentTablesIngot) {
				if (table.name === model.name) {
					databaseState.tablesWithOriginalNames.push({ table, model });
				}
			}
		}

		//якщо нема жодних збігів потенційної структури таблиць і теперішньої то просто робимо нову
		if (databaseState.tablesWithOriginalNames.length === 0) {
			return this.processingTablesWithModifiedState(potentialModels, currentTablesIngot);
		}

		//get new tables
		databaseState.tablesWithModifiedState.potentiallyNewTables = potentialModels
			.filter(model => !databaseState.tablesWithOriginalNames
				.some(tableWithOriginalName =>
					tableWithOriginalName.table.name === model.name
				)
			);

		console.log('currentTablesIngot', currentTablesIngot);
		//get deleted tables
		databaseState.tablesWithModifiedState.potentiallyDeletedTables = currentTablesIngot
			.filter(table => !databaseState.tablesWithOriginalNames
				.some(tableWithOriginalName =>
					tableWithOriginalName.table.name === table.name
				)
			);

		let tablesIngot: TableIngotInterface<DataSourceInterface>[] = [];

		if (
			databaseState.tablesWithModifiedState.potentiallyDeletedTables.length === 0 &&
			databaseState.tablesWithModifiedState.potentiallyNewTables.length > 0
		) {
			tablesIngot = this.processingNewTables(databaseState.tablesWithModifiedState.potentiallyNewTables);
		}

		console.log('databaseState.tablesWithModifiedState', databaseState.tablesWithModifiedState);
		if (
			databaseState.tablesWithModifiedState.potentiallyDeletedTables.length > 0 &&
			databaseState.tablesWithModifiedState.potentiallyNewTables.length > 0
		) {
			tablesIngot = [
				...tablesIngot,
				...this.processingTablesWithModifiedState(
					databaseState.tablesWithModifiedState.potentiallyNewTables,
					databaseState.tablesWithModifiedState.potentiallyDeletedTables
				)
			];
		}

		tablesIngot = [...tablesIngot, ...this.processingOriginalTables(databaseState.tablesWithOriginalNames)];

		return tablesIngot;
	}

	processingTablesWithModifiedState(
		potentiallyNewTables: TableIngotInterface<DataSourceInterface>[],
		potentiallyDeletedTables: TableIngotInterface<DataSourceInterface>[]
	) {
		const renamedTables: {
			table: TableIngotInterface<DataSourceInterface>
			model: TableIngotInterface<DataSourceInterface>
		}[] = [];
		const tablesWithPercentage = this.calculatePercentagesOfTablesWithModifiedState(potentiallyNewTables, potentiallyDeletedTables);

		for (const tableWithPercentage of tablesWithPercentage) {
			console.log('tableWithPercentage.percentages', tableWithPercentage.percentages);
			if (!tableWithPercentage.percentages.columnsPercentage) {
				break;
			}

			let percentage = tableWithPercentage.percentages.columnsPercentage;
			console.log('percentage', percentage);
			const percentagesWithoutFilter = Object.entries(tableWithPercentage.percentages).filter(entry => entry[0] != 'columnsPercentage');

			const countOfConditions = percentagesWithoutFilter.length;
			console.log('countOfConditions', countOfConditions);

			if (percentage === 100) {
				console.log('aaaaaaaaaaaaaaa');
				percentage = percentage - 100;
				const percentageForOneCondition = constants.tableComparerAlgorithm.maximumConvergenceOfTable / countOfConditions;
				for (const percentageForCondition of percentagesWithoutFilter) {
					percentage += (percentageForOneCondition * percentageForCondition[1]) / 100;
					console.log('percentage', percentage);
				}

				if (percentage > constants.tableComparerAlgorithm.minimumUniquesPercentage) {
					let { newTable, deletedTable } = tableWithPercentage;
					renamedTables.push({ table: deletedTable, model: newTable });
				}
				break;
			}

			if (percentage > constants.tableComparerAlgorithm.minimumUniquesPercentage) {
				console.log('percentage > constants.tableComparerAlgorithm.minimumUniquesPercentage');
				renamedTables.push({
					table: tableWithPercentage.deletedTable,
					model: tableWithPercentage.newTable
				});
				break;
			}

			if (countOfConditions === 0) {
				break;
			}

			const percentageForOneCondition = (constants.tableComparerAlgorithm.maximumConvergenceOfTable - percentage) / countOfConditions;
			console.log('percentageForOneCondition', percentageForOneCondition);

			for (const percentageForCondition of percentagesWithoutFilter) {
				percentage += (percentageForOneCondition * percentageForCondition[1]) / 100;
				console.log('percentage', percentage);
			}

			console.log('percentage', percentage);

			if (percentage > constants.tableComparerAlgorithm.minimumUniquesPercentage) {
				let { newTable, deletedTable } = tableWithPercentage;
				renamedTables.push({ table: deletedTable, model: newTable });
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

	calculateOptionsPercentage(
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

	calculateColumnPercentage(
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
		return percentage;
	}

	//TODO тут вказано чітко postgres, треба буде погратися з типами
	calculateConstraintsPercentage(
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

	calculatePrimaryKeyPercentages(
		newTablePrimaryKeys: string[],
		deletedTablePrimaryKeys: string[]
	): number {
		const commonPrimaryKeys = newTablePrimaryKeys.filter(primaryKey => deletedTablePrimaryKeys.includes(primaryKey));

		const percentage = (commonPrimaryKeys.length / deletedTablePrimaryKeys.length) * 100;
		return percentage;
	}

	calculateForeignKeysPercentage(
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

	//TODO тут вказано чітко postgres, треба буде погратися з типами
	calculatePercentagesOfTablesWithModifiedState(
		newTables: TableIngotInterface<DataSourcePostgres>[],
		deletedTables: TableIngotInterface<DataSourcePostgres>[]
	): {
		newTable: TableIngotInterface<DataSourcePostgres>,
		deletedTable: TableIngotInterface<DataSourcePostgres>,
		percentages: {
			columnsPercentage?: number
			optionsPercentage?: number
			constraintsPercentage?: number
			foreignKeyPercentage?: number
			primaryKeyPercentage?: number
		}
	}[] {
		const tablesPercentage = [];

		for (const newTable of newTables) {
			for (const deletedTable of deletedTables) {
				const tablePercentage: {
					newTable: TableIngotInterface<DataSourcePostgres>,
					deletedTable: TableIngotInterface<DataSourcePostgres>,
					percentages: {
						columnsPercentage?: number
						computedColumnPercentage?: number
						optionsPercentage?: number
						constraintsPercentage?: number
						foreignKeyPercentage?: number
						primaryKeyPercentage?: number
					}
				} = {
					newTable,
					deletedTable,
					percentages: {}
				};

				if (newTable?.columns?.length > 0 && deletedTable?.columns?.length === 0) {
					tablePercentage.percentages.columnsPercentage = 100;
				}

				if (deletedTable?.columns?.length > 0 && newTable?.columns?.length === 0) {
					tablePercentage.percentages.columnsPercentage = 100;
				}

				if (newTable?.columns?.length && deletedTable?.columns?.length) {
					tablePercentage.percentages.columnsPercentage = this.calculateColumnPercentage(
						newTable.columns,
						deletedTable.columns,
						newTable?.primaryColumn?.columnName ? newTable.primaryColumn.columnName : null,
						deletedTable?.primaryColumn?.columnName ? deletedTable.primaryColumn.columnName : null
					);
				}

				if (newTable?.computedColumns?.length && deletedTable?.computedColumns?.length) {
					tablePercentage.percentages.computedColumnPercentage = this.calculateColumnPercentage(
						newTable?.computedColumns,
						deletedTable?.computedColumns
					);
				}

				if (newTable?.options?.unique?.length && deletedTable?.options?.unique?.length) {
					tablePercentage.percentages.optionsPercentage = this.calculateOptionsPercentage(
						newTable.options,
						deletedTable.options
					);
				}

				if (newTable?.options?.checkConstraint && deletedTable?.options?.checkConstraint) {
					tablePercentage.percentages.constraintsPercentage = this.calculateConstraintsPercentage(
						newTable.options.checkConstraint,
						deletedTable.options.checkConstraint
					);
				}

				if (newTable?.foreignKeys?.length && deletedTable?.foreignKeys?.length)
					tablePercentage.percentages.foreignKeyPercentage = this.calculateForeignKeysPercentage(
						newTable.foreignKeys,
						deletedTable.foreignKeys
					);

				if (newTable?.options?.primaryKeys?.length && deletedTable?.options?.primaryKeys?.length) {
					tablePercentage.percentages.primaryKeyPercentage = this.calculatePrimaryKeyPercentages(
						newTable.options.primaryKeys,
						deletedTable.options.primaryKeys
					);
				}

				tablesPercentage.push(tablePercentage);
			}
		}

		return tablesPercentage;
	}


	processingNewTables(newTables: TableIngotInterface<DataSourceInterface>[]) {
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
	}[]) {
		const tablesForIngot = [];
		//processing tables with original names
		for (const potentialTable of potentialTables) {
			tablesForIngot.push({
				id: potentialTable.table.id ? potentialTable.table.id : uuidv4(),
				name: potentialTable.model.name,
				options: potentialTable.model.options, //TODO можливо потім будемо рефакторити options в table(якісь цікаві нові штуки туда добавим)
				columns: this.handleColumns<ColumnInterface<DataSourceInterface>[]>(
					potentialTable.table.columns,
					potentialTable.model.columns
				),
				computedColumns: this.handleColumns<ComputedColumnInterface<DataSourceInterface>[]>(
					potentialTable.table.computedColumns,
					potentialTable.model.computedColumns
				),
				foreignKeys: potentialTable.model.foreignKeys, //TODO подумати над тим чи foreignKeys мають бути з Id чи ні
				primaryColumn: potentialTable.model.primaryColumn
			});
		}

		return tablesForIngot;
	}

	handleColumns<T extends ColumnInterface<DataSourceInterface>[] | ComputedColumnInterface<DataSourceInterface>[]>
	(tableColumns: T, modelColumns: T) {
		let columns: any[] = [];
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
					columns.push({
						id: tableColumn.id ? tableColumn.id : uuidv4(),
						...modelColumn
					});
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

	// Кількість стовпців:
	// 	Відрізняння за кількістю стовпців: Якщо кількість стовпців відрізняється на значущий рівень, наприклад, більше або менше на певну кількість, то можна вважати таблицю новою.
	//
	// Назва таблиці і стовпців:
	// 	Відрізняння за назвою таблиці: Якщо таблиці мають різні назви, це, очевидно, вказує на нову таблицю.
	// 	Відрізняння за назвами стовпців: Якщо імена стовпців відрізняються, це також може бути чітким показником нової таблиці.
	//
	// Типи даних і обмеження:
	// 	Відрізняння за типами даних: Якщо типи даних відрізняються для стовпців, це може бути важливим критерієм для визначення нової таблиці.
	// 	Відрізняння за обмеженнями і ключами: Різниця в обмеженнях (наприклад, PRIMARY KEY, FOREIGN KEY) може також вказувати на нову таблицю.
	//
	// Додаткові параметри:
	// 	Врахування додаткових параметрів: Якщо є додаткові властивості, такі як тригери, коментарі, то їх врахування може бути важливим.
	//
	// Динамічні характеристики:
	// 	Динамічні зміни кількості стовпців: Якщо додавання або видалення стовпців відбувається динамічно, можливо, варто встановити певний поріг, за яким ви вважатимете таблицю новою.

	generateCreateTableQuery(ingotsOfTables: TableIngotInterface<DataSourceInterface>[]): string {
		let createTablesQuery = '';

		for (const { columns, computedColumns, foreignKeys, primaryColumn, ...table } of ingotsOfTables) {
			createTablesQuery += this._dataSource.createTable(table, columns, computedColumns, foreignKeys, primaryColumn) + '\n\n';
		}

		console.log('Sql of table create', createTablesQuery);
		return createTablesQuery;
	}
}