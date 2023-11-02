import {DataSourceInterface} from "./interfaces/data-source.interface";
import {PoolClient} from "pg";
import {Connection} from "mysql2/promise";
import {DataSourcePostgres} from "./data-source-postgres";
import {ConnectionData} from "./types/connection-data";
import {DataSourceContextInterface} from "./interfaces/data-source-context.interface";
import {EntityInterface} from "./interfaces/entity.interface";
import {TableInterface} from "./interfaces/decorators/table/table.interface";
import {ColumnMetadataInterface} from "./interfaces/decorators/column/column-metadata.interface";

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

    // Функція для виконання асинхронного створення таблиць і складання даних з декораторів
    async createTables(entities: EntityInterface[]): Promise<void> {
        for (const entity of entities) {
            const table: TableInterface
                = Reflect.getMetadata('table', entity.prototype);
            const metadataColumns: ColumnMetadataInterface[]
                = Reflect.getMetadata('columns', entity.prototype);

            const columns = metadataColumns.map(metadataColumn => {
                const {propertyKey, ...column} = metadataColumn;
                return column;
            })

            const createTableSQL = this._dataSource.createTable(table, columns);
            console.log("createTableSQLcreateTableSQL", createTableSQL)
            await this._dataSource.client.query(createTableSQL);
        }
    }

    get client(): DataSourceInterface extends DataSourcePostgres ? PoolClient : Connection {
        return this._client;
    }
}

export {DataSourceContext};