import {dataSourceService} from "../data-source-service";
import {DatabasesTypes} from "../enums/databases-types";
import {tableNames} from "../types/tables";

export function Table(sss?: string): Function {
    return async function (constructor: Function): Promise<void> {
        console.log("1111111111111111");
        const tableName = constructor.name;

        tableNames.push(tableName);
        let createTableSQL;

        const connectionClient = await dataSourceService.getConnectionClient();

        const { connectionData, dataSource } = connectionClient;
        console.log("connectionData", connectionData.type);

        if (connectionData.type === DatabasesTypes.MYSQL)
            createTableSQL = `
                CREATE TABLE IF NOT EXISTS ${tableName} (
                    id INT AUTO_INCREMENT PRIMARY KEY
                );
            `;

        if (connectionData.type === DatabasesTypes.POSTGRES)
            createTableSQL = `
                CREATE TABLE IF NOT EXISTS "${tableName}" (
                  id SERIAL PRIMARY KEY
                );
            `;

        try {
            await dataSource.client.query(createTableSQL);
            console.log(`Table ${tableName} created successfully.`);
        } catch (error) {
            console.error('error', error);
        }

        console.log('222222222222222222');
    };
}