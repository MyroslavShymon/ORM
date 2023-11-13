import { PoolClient } from 'pg';
import { Connection } from 'mysql2/promise';
import {
	ColumnMetadataInterface,
	DataSourceContextInterface,
	DataSourceInterface,
	EntityInterface,
	TableInterface
} from './interfaces';
import { DataSourcePostgres } from './data-source-postgres';
import { ConnectionData } from './types';
import { ComputedColumnMetadataInterface } from './interfaces/decorators/computed-column';

class DataSourceContext implements DataSourceContextInterface {
	private _dataSource: DataSourceInterface;
	private _client: DataSourceInterface extends DataSourcePostgres ? PoolClient : Connection;

	setDatabase(dataSource: DataSourceInterface): void {
		this._dataSource = dataSource;
	}

	async connectDatabase(connectionData: ConnectionData): Promise<void> {
		await this._dataSource.connect(connectionData);

		this._client = await this._dataSource.client;
	}

	async getCurrentTime(): Promise<Object> {
		const getCurrentTimestampQuery = this._dataSource.getCurrentTimestamp();

		return this._dataSource.client.query(getCurrentTimestampQuery);
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
			console.log('createTableSQLcreateTableSQL', createTableSQL);
			await this._dataSource.client.query(createTableSQL);
		}
	}

	get client(): DataSourceInterface extends DataSourcePostgres ? PoolClient : Connection {
		return this._client;
	}
}

export { DataSourceContext };