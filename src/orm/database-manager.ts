import {ConnectionData} from "./types/connection-data";
import {DatabasesTypes} from "./enums/databases-types";
import {DataSourcePostgres} from "./data-source-postgres";
import {DataSourceMySql} from "./data-source-mysql";
import {DataSource} from "./data-source";
import {PoolClient} from "pg";

class DatabaseManager {
    _connectionData: ConnectionData;
    _dataSource: DataSource = new DataSource();

    constructor(connectionData: ConnectionData) {
        this._connectionData = connectionData;
    }

    async connection(): Promise<DataSource> {
        if (this._connectionData.type === DatabasesTypes.POSTGRES) {
            this._dataSource.setDatabase(new DataSourcePostgres());

            await this._dataSource.connectDatabase(this._connectionData);

            try {
                const results = await this._dataSource.client.query('SELECT current_timestamp;');
                console.log('results', results);
            } catch (error) {
                console.error('error', error);
            } finally {
                await this._dataSource.client.release();
            }
        }

        if (this._connectionData.type === DatabasesTypes.MYSQL) {
            this._dataSource.setDatabase(new DataSourceMySql());
            //TODO
            const {type, ...data} = this._connectionData

            try {
                await this._dataSource.connectDatabase(data);

                const results = await this._dataSource.client.query("SELECT NOW();");
                console.log('results', results);
            } catch (error) {
                console.error('error', error)
            }
        }

        return this._dataSource;
    }


    set connectionData(connectionData: ConnectionData) {
        this._connectionData = connectionData;
    }

    set dataSource(dataSource: DataSource) {
        this._dataSource = dataSource;
    }

    get connectionData(): ConnectionData {
        return this._connectionData
    }

    get dataSource(): DataSource {
        return this._dataSource
    }
}

export {DatabaseManager}