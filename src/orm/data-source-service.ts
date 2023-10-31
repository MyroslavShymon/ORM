import { DataSource } from "./data-source";
import {ConnectionData} from "./types/connection-data";
import {ConnectionClient} from "./types/connection-client";

class DataSourceService {
    private _dataSource: DataSource | null = null;
    private _connectionData: ConnectionData | null = null;
    private _connectionClient: Promise<ConnectionClient> | null = null;

    setDataSource(dataSource: DataSource) {
        this._dataSource = dataSource;
    }

    setConnectionData(connectionData: ConnectionData) {
        this._connectionData = connectionData;
    }

    setConnectionClient(connectionClient: Promise<ConnectionClient>) {
        this._connectionClient = connectionClient;
    }

    getDataSource(): DataSource | null {
        return this._dataSource;
    }

    getConnectionData(): ConnectionData | null {
        return this._connectionData;
    }

    getConnectionClient(): Promise<ConnectionClient> | null {
        return this._connectionClient;
    }
}

export const dataSourceService = new DataSourceService();