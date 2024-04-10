import {
	DataSourceInterface,
	ForeignKeyInterface,
	ModelInterface,
	PrimaryGeneratedColumnInterface,
	TableIngotInterface,
	TableInterface
} from '@core/interfaces';
import { ComputedColumnMetadataInterface } from '@decorators/index';
import { DatabaseStateBuilderInterface, DatabaseStateInterface } from '@context/common';

export class DatabaseStateBuilder implements DatabaseStateBuilderInterface {
	constructor() {
	}

	getPreparedModels(models: ModelInterface[]): TableIngotInterface<DataSourceInterface>[] {
		const preparedModels: TableIngotInterface<DataSourceInterface>[] = [];

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