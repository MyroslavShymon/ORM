import { TableCreatorInterface } from '@context/interfaces';
import { DataSourceInterface, TableInterface } from '@core/interfaces';
import {
	ComputedColumnMetadataInterface,
	ForeignKeyInterface,
	PrimaryGeneratedColumnInterface
} from '@decorators/postgres';
import { TableIngotInterface } from '@core/interfaces/table-ingot.interface';
import { constants } from '@core/constants';
import { ConnectionData } from '@core/types';

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

			let columns;
			if (metadataColumns) {
				columns = metadataColumns.map(metadataColumn => {
					const { propertyKey, ...column } = metadataColumn;
					return column;
				});

				columns = columns.map(column => ({ ...column }));
			}

			let computedColumns;
			if (metadataComputedColumns) {
				computedColumns = metadataComputedColumns.map(metadataColumn => {
					const { propertyKey, ...column } = metadataColumn;
					return column;
				});

				computedColumns = computedColumns.map(computedColumn => ({ ...computedColumn }));
			}

			const potentialModel = {
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

		const databaseState = {
			tablesWithOriginalNames: [],
			tablesWithModifiedState: {
				deletedTables: [],
				newTables: []
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

		//get new tables
		databaseState.tablesWithModifiedState.newTables = potentialModels
			.filter(model => !databaseState.tablesWithOriginalNames
				.some(tableWithOriginalName =>
					tableWithOriginalName.table.name === model.name
				)
			);

		//get deleted tables
		databaseState.tablesWithModifiedState.deletedTables = currentTablesIngot
			.filter(table => !databaseState.tablesWithOriginalNames
				.some(tableWithOriginalName =>
					tableWithOriginalName.table.name === table.name
				)
			);

		console.log('databaseState.tablesWithModifiedState', databaseState.tablesWithModifiedState);
		console.log('databaseState.tablesWithOriginalNames', databaseState.tablesWithOriginalNames);

		return potentialModels;
	}

	// Кількість стовпців:
	// 	Відрізняння за кількістю стовпців: Якщо кількість стовпців відрізняється на значущий рівень, наприклад, більше або менше на певну кількість, то можна вважати таблицю новою.
	//
	// Назва таблиці і стовпців:
	// 	Відрізняння за назвою таблиці: Якщо таблиці мають різні назви, це, очевидно, вказує на нову таблицю.
	// Відрізняння за назвами стовпців: Якщо імена стовпців відрізняються, це також може бути чітким показником нової таблиці.
	//
	// Типи даних і обмеження:
	// 	Відрізняння за типами даних: Якщо типи даних відрізняються для стовпців, це може бути важливим критерієм для визначення нової таблиці.
	// Відрізняння за обмеженнями і ключами: Різниця в обмеженнях (наприклад, PRIMARY KEY, FOREIGN KEY) може також вказувати на нову таблицю.
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