import {DataSourceInterface} from "./interfaces/data-source.interface";
import {ConnectionData} from "./types/connection-data";
import {Connection, createConnection} from "mysql2/promise";

export class DataSourceMySql implements DataSourceInterface {
    client: Connection;

    async connect(dataToConnect: ConnectionData): Promise<void> {
        this.client = await createConnection(dataToConnect);
    }
}