import {DataSource} from "../data-source";
import {ConnectionData} from "./connection-data";

export type ConnectionClient = {
    dataSource: DataSource,
    connectionData: ConnectionData,
}