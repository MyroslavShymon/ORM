import {DataSourceInterface} from "./interfaces/data-source.interface";
import {ConnectionData} from "./types/connection-data";
import {Connection, createConnection} from "mysql2/promise";
import {TableOptionsInterface} from "./interfaces/decorators/table-options.interface";
import {ColumnInterface} from "./interfaces/decorators/column.interface";

export class DataSourceMySql implements DataSourceInterface {
    client: Connection;

    async connect(dataToConnect: ConnectionData): Promise<void> {
        this.client = await createConnection(dataToConnect);
    }

    createTable(table: TableOptionsInterface, columns: ColumnInterface[]): string {
        let createTableSQL;
        console.log("POSTGRES")
        console.log("TABLE", table);
        console.log("COLUMN", columns);

        createTableSQL = `
                CREATE TABLE IF NOT EXISTS ${table.tableName} (
                    id INT AUTO_INCREMENT PRIMARY KEY
                );
            `;

        return createTableSQL;
    }
}