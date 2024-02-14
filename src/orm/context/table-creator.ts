import { v4 as uuidv4 } from 'uuid';
import { TableCreatorInterface } from '@context/interfaces';
import { DataSourceInterface, TableInterface } from '@core/interfaces';
import {
	ColumnMetadataInterface,
	ComputedColumnMetadataInterface,
	ForeignKeyInterface,
	PrimaryGeneratedColumnInterface
} from '@decorators/postgres';
import { TableIngotInterface } from '@core/interfaces/table-ingot.interface';
import { constants } from '@core/constants';
import { ConnectionData } from '@core/types';

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
		let tablesIngot: TableIngotInterface<DataSourceInterface>[] = [];

		const currentDatabaseIngot = await this._dataSource.migrationService.getCurrentDatabaseIngot(
			this._dataSource,
			migrationTable,
			migrationTableSchema
		);

		if (currentDatabaseIngot.tables) {
			tablesIngot = currentDatabaseIngot.tables;
		}

		for (const model of models) {
			const table: TableInterface<DataSourceInterface>
				= Reflect.getMetadata('table', model.prototype);
			const metadataColumns: ColumnMetadataInterface[]
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

			// {TODO тут лишається undefined тому не ясно як з цим далі треба буде працювати
			// 	name: 'product',
			// 	options: undefined,
			// 	columns: [Array],
			// 	computedColumns: undefined
			// }

			//TODO check and fix
			if (tablesIngot.length === 0) {
				tablesIngot.push({ id: uuidv4(), ...table, columns, computedColumns, foreignKeys, primaryColumn });
			}

			if (tablesIngot.length !== 0) {
				const existingTableIndex = tablesIngot.findIndex(currentTable => currentTable.name === table.name);

				if (existingTableIndex === -1) {
					tablesIngot.push({
						id: uuidv4(),
						...table,
						columns,
						computedColumns,
						foreignKeys,
						primaryColumn
					});
				}
			}

			tablesIngot = tablesIngot.filter(tableIngot =>
				models.some(model => Reflect.getMetadata('table', model.prototype).name === tableIngot.name)
			);
		}

		return tablesIngot;
	}

	generateCreateTableQuery(ingotsOfTables: TableIngotInterface<DataSourceInterface>[]): string {
		let createTablesQuery = '';

		for (const { columns, computedColumns, foreignKeys, primaryColumn, ...table } of ingotsOfTables) {
			createTablesQuery += this._dataSource.createTable(table, columns, computedColumns, foreignKeys, primaryColumn) + '\n\n';
		}

		console.log('Sql of table create', createTablesQuery);
		return createTablesQuery;
	}
}