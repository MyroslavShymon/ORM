import {ConnectionData} from "../types/connection-data";

export interface DataSourceInterface {
    client
    connect(dataToConnect: ConnectionData);
}
