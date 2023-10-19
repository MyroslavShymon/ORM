import {DataSourceInterface} from "./interfaces/data-source.interface";
import {Pool, PoolClient} from "pg";
import {ConnectionData} from "./types/connection-data";

export class DataSourcePostgres implements DataSourceInterface {
    client: PoolClient;

    async connect(dataToConnect: ConnectionData): Promise<void> {
        const pool = new Pool(dataToConnect);
        this.client = await pool.connect();
    }
}