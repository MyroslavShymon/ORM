import {ConnectionData} from "../types/connection-data";
import {TableOptionsInterface} from "./decorators/table-options.interface";
import {ColumnInterface} from "./decorators/column.interface";

export interface DataSourceInterface {
    client
    connect(dataToConnect: ConnectionData);
    createTable(table: TableOptionsInterface, columns: ColumnInterface[]): string;
}
