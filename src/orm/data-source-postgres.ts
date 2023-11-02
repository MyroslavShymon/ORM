import {DataSourceInterface} from "./interfaces/data-source.interface";
import {Pool, PoolClient} from "pg";
import {ConnectionData} from "./types/connection-data";
import {ColumnInterface} from "./interfaces/decorators/column/column.interface";
import {TableInterface} from "./interfaces/decorators/table/table.interface";
import {PostgresqlDataTypes} from "./enums/postgresql-data-types";

export class DataSourcePostgres implements DataSourceInterface {
    client: PoolClient;

    async connect(dataToConnect: ConnectionData): Promise<void> {
        const pool = new Pool(dataToConnect);
        this.client = await pool.connect();
    }

    createTable(table: TableInterface, columns: ColumnInterface[]): string {
        console.log("POSTGRES")
        console.log("TABLE", table);
        console.log("COLUMN", columns);

        let createTableSQL;
        createTableSQL = `
                CREATE TABLE IF NOT EXISTS "${table.name}" (
                  id SERIAL PRIMARY KEY,
            `;

        const columnStrings = columns.map(({name, options}) => {
            if (!options.dataType) {
                throw new Error("Ви не вказали тип колонки");
            }

            if (
               (options.dataType === PostgresqlDataTypes.CHAR ||
                options.dataType === PostgresqlDataTypes.VARCHAR) && !options.length
            ) {
                throw new Error("Ви не вказали довжину рядка");
            }

            let stringDataType = ''

            if (options.length) {
                stringDataType = `(${options.length})`
            }

            return `"${name}" ${options.dataType}${stringDataType}`;
        });
        createTableSQL += columnStrings.join(', ');

        createTableSQL += `);`

        return createTableSQL;
    }
}