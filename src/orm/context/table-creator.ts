import { TableCreatorInterface } from '@context/interfaces';
import { DataSourceInterface, ModelInterface, TableInterface } from '@core/interfaces';
import { ColumnMetadataInterface, ComputedColumnMetadataInterface } from '@decorators/postgres';
import { TableIngotInterface } from '@core/interfaces/table-ingot.interface';

export class TableCreator implements TableCreatorInterface {
	private _dataSource: DataSourceInterface;

	constructor(dataSource: DataSourceInterface) {
		this._dataSource = dataSource;
	}

	// Функція для виконання асинхронного створення таблиць і складання даних з декораторів
	async createTables(models: ModelInterface[]): Promise<TableIngotInterface<DataSourceInterface>[]> {
		const tablesIngot: TableIngotInterface<DataSourceInterface>[] = [];

		for (const model of models) {
			const table: TableInterface<DataSourceInterface>
				= Reflect.getMetadata('table', model.prototype);
			const metadataColumns: ColumnMetadataInterface[]
				= Reflect.getMetadata('columns', model.prototype);
			const metadataComputedColumns: ComputedColumnMetadataInterface[]
				= Reflect.getMetadata('computed-columns', model.prototype);

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

			// {TODO тут лишається undefined тому не ясно як з цим далі треба буде працювати
			// 	name: 'product',
			// 	options: undefined,
			// 	columns: [Array],
			// 	computedColumns: undefined
			// }

			tablesIngot.push({ ...table, columns, computedColumns });

			const createTableQuery = this._dataSource.createTable(table, columns, computedColumns);

			console.log('Sql of table create', createTableQuery);
			await this._dataSource.client.query(createTableQuery);
		}

		return tablesIngot;
	}
}