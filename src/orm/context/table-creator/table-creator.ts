import {
	DatabaseStateBuilderInterface,
	DatabaseStateInterface,
	ManyToManyRelationsOfTablesInterface,
	TableCreationProcessorInterface,
	TableCreatorInterface
} from '@context/common';
import { DatabaseIngotInterface, DataSourceInterface, ManyToManyInterface } from '@core/interfaces';
import { TableIngotInterface } from '@core/interfaces/table-ingot.interface';
import { constants } from '@core/constants';
import { ConnectionData } from '@core/types';
import { TableCreationProcessor } from '@context/table-creator/table-creation-processor';
import { DatabaseStateBuilder } from '@context/table-creator/database-state-builder';

export class TableCreator implements TableCreatorInterface {
	private readonly _dataSource: DataSourceInterface;
	private readonly _tableCreationProcessor: TableCreationProcessorInterface = new TableCreationProcessor();
	private readonly _databaseStateBuilder: DatabaseStateBuilderInterface = new DatabaseStateBuilder();

	constructor(dataSource: DataSourceInterface) {
		this._dataSource = dataSource;
	}

	async createIngotOfTables({
								  models,
								  migrationTable = constants.migrationsTableName,
								  migrationTableSchema = constants.migrationsTableSchemaName
							  }: ConnectionData): Promise<TableIngotInterface<DataSourceInterface>[] | undefined> {
		if (!models || models.length === 0) {
			return [];
		}

		let { tables: currentTablesIngot }: DatabaseIngotInterface =
			await this._dataSource.getCurrentDatabaseIngot(
				this._dataSource,
				migrationTable,
				migrationTableSchema
			);

		let preparedModels: TableIngotInterface<DataSourceInterface>[] = this._databaseStateBuilder.getPreparedModels(models);

		const databaseState: DatabaseStateInterface = this._databaseStateBuilder.formationOfDatabaseState(preparedModels, currentTablesIngot);
		//якщо нема жодних збігів потенційної структури таблиць і теперішньої то перевіряємо чи всі таблиці не перейменовані і обробляємо їх
		if (databaseState.tablesWithOriginalNames.length === 0) {
			return this._tableCreationProcessor.processingTablesWithModifiedState(preparedModels, currentTablesIngot);
		}

		return this._formationOfTableIngot(databaseState);
	}

	private _formationOfTableIngot(
		databaseState: DatabaseStateInterface
	): TableIngotInterface<DataSourceInterface>[] {
		let tablesIngot: TableIngotInterface<DataSourceInterface>[] = [];

		if (
			databaseState.tablesWithModifiedState.potentiallyDeletedTables.length === 0 &&
			databaseState.tablesWithModifiedState.potentiallyNewTables.length > 0
		) {
			tablesIngot = this._tableCreationProcessor.processingNewTables(databaseState.tablesWithModifiedState.potentiallyNewTables);
		}

		if (
			databaseState.tablesWithModifiedState.potentiallyDeletedTables.length > 0 &&
			databaseState.tablesWithModifiedState.potentiallyNewTables.length > 0
		) {
			tablesIngot = [
				...tablesIngot,
				...this._tableCreationProcessor.processingTablesWithModifiedState(
					databaseState.tablesWithModifiedState.potentiallyNewTables,
					databaseState.tablesWithModifiedState.potentiallyDeletedTables
				)
			];
		}

		tablesIngot = [...tablesIngot, ...this._tableCreationProcessor.processingOriginalTables(databaseState.tablesWithOriginalNames)];

		return tablesIngot;
	}

	generateCreateTableQueryForManyToManyRelation(manyToManyRelationsOfTables: ManyToManyRelationsOfTablesInterface[]): string {
		let createTablesQueryForManyToManyRelation = '';
		const manyToManys: ManyToManyInterface[] = [];
		const createdManyToManyTables: string[] = [];

		for (const {
			manyToManyRelation, tableName
		} of manyToManyRelationsOfTables) {
			if (manyToManyRelation?.length) {
				manyToManys.push(...manyToManyRelation.map(m2m => ({ ...m2m, tableName })));
			}
		}

		for (let i = 0; i < manyToManys.length; i++) {
			for (let j = 0; j < manyToManys.length; j++) {
				if (
					i !== j &&
					manyToManys[i].referencedTable === manyToManys[j].tableName &&
					manyToManys[i].tableName === manyToManys[j].referencedTable
				) {
					const tableName = `${manyToManys[i].referencedTable}_${manyToManys[j].referencedTable}`;

					if (!createdManyToManyTables.some(createdManyToManyTable => createdManyToManyTable ===
						tableName
							.split('_')
							.reverse()
							.join('_'))
					) {
						createTablesQueryForManyToManyRelation += this._dataSource.createTable(
							{
								table: {
									name: tableName,
									options:
										{
											primaryKeys: [
												manyToManys[i].foreignKey,
												manyToManys[j].foreignKey
											]
										}
								},
								oneToMany: [
									{
										tableName: manyToManys[i].referencedTable,
										referenceColumn: manyToManys[i].referencedColumn,
										foreignKey: manyToManys[i].foreignKey
									},
									{
										tableName: manyToManys[j].referencedTable,
										referenceColumn: manyToManys[j].referencedColumn,
										foreignKey: manyToManys[j].foreignKey
									}
								]
							}
						) + '\n\n';
						createdManyToManyTables.push(tableName);
					}
				}
			}
		}

		return createTablesQueryForManyToManyRelation;
	}

	generateCreateTableQuery(ingotsOfTables: TableIngotInterface<DataSourceInterface>[]): string {
		let createTablesQuery = '';

		for (const {
			oneToMany,
			manyToMany,
			oneToOne,
			computedColumns,
			columns,
			primaryColumn,
			foreignKeys,
			...table
		} of ingotsOfTables) {
			createTablesQuery += this._dataSource.createTable({
				oneToMany,
				manyToMany,
				oneToOne,
				columns,
				computedColumns,
				primaryColumn,
				foreignKeys,
				table
			}) + '\n\n';
		}

		createTablesQuery += this.generateCreateTableQueryForManyToManyRelation(
			ingotsOfTables.map(table => ({ manyToManyRelation: table.manyToMany, tableName: table.name }))
		);

		console.log('Sql of table create', createTablesQuery);
		return createTablesQuery;
	}
}