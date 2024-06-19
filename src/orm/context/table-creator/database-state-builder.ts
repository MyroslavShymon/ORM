import {
	DataSourceInterface,
	ForeignKeyInterface,
	ManyToManyInterface,
	ModelInterface,
	OneToManyInterface,
	OneToOneInterface,
	PrimaryGeneratedColumnInterface,
	TableIngotInterface,
	TableInterface
} from '@core/interfaces';
import { ComputedColumnMetadataInterface } from '@decorators/index';
import { DatabaseStateBuilderInterface, DatabaseStateInterface } from '@context/common';
import { constants } from '@core/constants';

export class DatabaseStateBuilder implements DatabaseStateBuilderInterface {
	constructor() {
	}

	getPreparedModels(models: ModelInterface[]): TableIngotInterface<DataSourceInterface>[] {
		const preparedModels: TableIngotInterface<DataSourceInterface>[] = [];

		for (let model of models) {
			const table: TableInterface
				= Reflect.getMetadata(constants.decoratorsMetadata.table, model.prototype);
			const metadataColumns
				= Reflect.getMetadata(constants.decoratorsMetadata.columns, model.prototype);
			const metadataComputedColumns: ComputedColumnMetadataInterface[]
				= Reflect.getMetadata(constants.decoratorsMetadata.computedColumns, model.prototype);
			const foreignKeys: ForeignKeyInterface[]
				= Reflect.getMetadata(constants.decoratorsMetadata.foreignKeys, model.prototype) || [];
			const primaryColumn: PrimaryGeneratedColumnInterface
				= Reflect.getMetadata(constants.decoratorsMetadata.primaryColumn, model.prototype) || {};
			const oneToOne: OneToOneInterface[]
				= Reflect.getMetadata(constants.decoratorsMetadata.oneToOne, model.prototype) || [];
			const oneToMany: OneToManyInterface[]
				= Reflect.getMetadata(constants.decoratorsMetadata.oneToMany, model.prototype) || [];
			const manyToMany: ManyToManyInterface[]
				= Reflect.getMetadata(constants.decoratorsMetadata.manyToMany, model.prototype) || [];

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
				primaryColumn,
				oneToOne,
				oneToMany,
				manyToMany: manyToMany.map(m2m => ({ ...m2m, tableName: table.name }))
			};

			preparedModels.push(potentialModel);
		}

		return preparedModels;
	}

	formationOfDatabaseState(
		preparedModels: TableIngotInterface<DataSourceInterface>[],
		currentTablesIngot: TableIngotInterface<DataSourceInterface>[]
	): DatabaseStateInterface {
		const databaseState: DatabaseStateInterface = {
			tablesWithOriginalNames: [],
			tablesWithModifiedState: {
				potentiallyDeletedTables: [],
				potentiallyNewTables: []
			}
		};

		//get tables with original names
		for (const model of preparedModels) {
			for (const table of currentTablesIngot) {
				if (table.name === model.name) {
					databaseState.tablesWithOriginalNames.push({ table, model });
				}
			}
		}

		if (databaseState.tablesWithOriginalNames.length > 0) {
			//get new tables
			databaseState.tablesWithModifiedState.potentiallyNewTables = preparedModels
				.filter(model => !databaseState.tablesWithOriginalNames
					.some(tableWithOriginalName =>
						tableWithOriginalName.table.name === model.name
					)
				);

			//get deleted tables
			databaseState.tablesWithModifiedState.potentiallyDeletedTables = currentTablesIngot
				.filter(table => !databaseState.tablesWithOriginalNames
					.some(tableWithOriginalName =>
						tableWithOriginalName.table.name === table.name
					)
				);
		}

		return databaseState;
	}
}