import { ColumnMetadataInterface, DataSourceInterface, EntityInterface, TableInterface } from '../../interfaces';
import { ComputedColumnMetadataInterface } from '../../interfaces/decorators/computed-column';
import { TableCreatorInterface } from './interfaces';

export class TableCreator implements TableCreatorInterface {
	private _dataSource: DataSourceInterface;

	constructor(dataSource: DataSourceInterface) {
		this._dataSource = dataSource;
	}

	// Функція для виконання асинхронного створення таблиць і складання даних з декораторів
	async createTables(entities: EntityInterface[]): Promise<void> {
		for (const entity of entities) {
			const table: TableInterface
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