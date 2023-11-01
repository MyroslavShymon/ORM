import {DataSourceInterface} from "./interfaces/data-source.interface";
import {Pool, PoolClient} from "pg";
import {ConnectionData} from "./types/connection-data";
import {TableOptionsInterface} from "./interfaces/decorators/table-options.interface";
import {ColumnInterface} from "./interfaces/decorators/column.interface";

export class DataSourcePostgres implements DataSourceInterface {
    client: PoolClient;

    async connect(dataToConnect: ConnectionData): Promise<void> {
        const pool = new Pool(dataToConnect);
        this.client = await pool.connect();
    }

    createTable(table: TableOptionsInterface, columns: ColumnInterface[]): string {
        console.log("POSTGRES")
        console.log("TABLE", table);
        console.log("COLUMN", columns);

        let createTableSQL;
        createTableSQL = `
                CREATE TABLE IF NOT EXISTS "${table.tableName}" (
                  id SERIAL PRIMARY KEY,
            `;

        const columnStrings = columns.map(column => `"${column.propertyKey}" ${column.options.dataType}`);
        createTableSQL += columnStrings.join(', ');

        createTableSQL += `);`

        return createTableSQL;
    }
}