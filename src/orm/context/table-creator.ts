import { TableCreatorInterface } from './interfaces';
import { DataSourceInterface, EntityInterface, TableInterface } from '../core';
import { ColumnMetadataInterface, ComputedColumnMetadataInterface } from '../decorators';

export class TableCreator implements TableCreatorInterface {
	private _dataSource: DataSourceInterface;

	constructor(dataSource: DataSourceInterface) {
		this._dataSource = dataSource;
	}

	// Функція для виконання асинхронного створення таблиць і складання даних з декораторів
	async createTables(entities: EntityInterface[]): Promise<void> {
		for (const entity of entities) {
			const table: TableInterface<DataSourceInterface>
				= Reflect.getMetadata('table', entity.prototype);
			const metadataColumns: ColumnMetadataInterface[]
				= Reflect.getMetadata('columns', entity.prototype);
			const metadataComputedColumns: ComputedColumnMetadataInterface[]
				= Reflect.getMetadata('computed-columns', entity.prototype);

			let columns;
			if (metadataColumns) {
				columns = metadataColumns.map(metadataColumn => {
					const { propertyKey, ...column } = metadataColumn;
					return column;
				});
			}

			let computedColumns;
			if (metadataComputedColumns) {
				computedColumns = metadataComputedColumns.map(metadataColumn => {
					const { propertyKey, ...column } = metadataColumn;
					return column;
				});
			}

			const createTableSQL = this._dataSource.createTable(table, columns, computedColumns);
			console.log('Sql of table create', createTableSQL);
			await this._dataSource.client.query(createTableSQL);
		}
	}
}