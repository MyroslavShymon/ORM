import {DataSourceInterface} from "./interfaces/data-source.interface";
import {PoolClient} from "pg";
import {Connection} from "mysql2/promise";
import {DataSourcePostgres} from "./data-source-postgres";
import {ConnectionData} from "./types/connection-data";
import {DataSourceContextInterface} from "./interfaces/data-source-context.interface";

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

    get client(): DataSourceInterface extends DataSourcePostgres ? PoolClient : Connection {
        return this._client;
    }
}

export {DataSourceContext};