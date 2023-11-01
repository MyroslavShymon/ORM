import {ConnectionClient} from "../types/connection-client";
import {ConnectionData} from "../types/connection-data";
import {DataSourceContext} from "../data-source-context";

export interface DatabaseManagerInterface {
    connectionData: ConnectionData;
    dataSource: DataSourceContext;

    connection(): Promise<ConnectionClient>;
}