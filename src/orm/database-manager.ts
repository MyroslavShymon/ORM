import 'reflect-metadata';
import {ConnectionData} from "./types/connection-data";
import {DatabasesTypes} from "./enums/databases-types";
import {DataSourcePostgres} from "./data-source-postgres";
import {DataSourceMySql} from "./data-source-mysql";
import {DataSourceContext} from "./data-source-context";
import {ConnectionClient} from "./types/connection-client";

class DatabaseManager {
    _connectionData: ConnectionData;
    _dataSource: DataSourceContext = new DataSourceContext();

    constructor(connectionData: ConnectionData) {
        this._connectionData = connectionData;
    }

    async connection(): Promise<ConnectionClient> {
        if (this._connectionData.type === DatabasesTypes.POSTGRES) {
            this._dataSource.setDatabase(new DataSourcePostgres());

            await this._dataSource.connectDatabase(this._connectionData);

            try {
                const results = await this._dataSource.client.query('SELECT current_timestamp;');
                console.log('results', results);
            } catch (error) {
                console.error('error', error);
            } finally {
                await this._dataSource.client.release();
            }
        }

        if (this._connectionData.type === DatabasesTypes.MYSQL) {
            this._dataSource.setDatabase(new DataSourceMySql());

            //TODO
            // const {type, ...data} = this._connectionData;

            try {
                await this._dataSource.connectDatabase(this._connectionData);
                console.log("this._dataSource.client", this._dataSource, this._dataSource.client)
                const results = await this._dataSource.client.query("SELECT NOW();");
                console.log('results', results);
            } catch (error) {
                console.error('error', error)
            }
        }

        return {
            dataSource: this._dataSource,
            connectionData: this._connectionData,
        };
    }

    // Функція для виконання асинхронного запиту і складання даних з декораторів
    private async _executeQuery(target: TableInterface): Promise<{ tableName: string, columns: any[] }> {
        let createTableSQL;
        const table = Reflect.getMetadata('table', target.prototype);
        const columns = Reflect.getMetadata('columns', target.prototype);


        if (this._connectionData.type === DatabasesTypes.MYSQL)
            createTableSQL = `
                CREATE TABLE IF NOT EXISTS ${table.tableName} (
                    id INT AUTO_INCREMENT PRIMARY KEY
                );
            `;

        if (this._connectionData.type === DatabasesTypes.POSTGRES) {
            createTableSQL = `
                CREATE TABLE IF NOT EXISTS "${table.tableName}" (
                  id SERIAL PRIMARY KEY,
            `;

            const columnStrings = columns.map(column => `"${column.propertyKey}" ${column.options.dataType}`);
            createTableSQL += columnStrings.join(', ');

            createTableSQL += `);`
        }

        console.log("createTableSQL", createTableSQL)

        await this._dataSource.client.query(createTableSQL);

        // // Виводимо інформацію про кожну колонку та її таблицю
        // for (const column of columns) {
        //     console.log(`Column: ${column}, Table: ${table.tableName}`);
        // }

        // Ваш код для виконання запиту і складання даних з декораторів
        // Тут ви можете використовувати, наприклад, TypeORM, Knex, або іншу ORM або бібліотеку для виконання запитів

        // Приклад реалізації запиту з фіктивними даними
        const result = { tableName: table.tableName, columns };
        return result;
    }

    testDecorators(tableClasses) {
        // Виконання запиту для класів BBB і ttt і виведення результату
        for (const classType of tableClasses) {
            this._executeQuery(classType).then((result) => {
                console.log(result.columns);
                console.log(result.tableName);
            });
        }
    }

    set connectionData(connectionData: ConnectionData) {
        this._connectionData = connectionData;
    }

    set dataSource(dataSource: DataSourceContext) {
        this._dataSource = dataSource;
    }

    get connectionData(): ConnectionData {
        return this._connectionData
    }

    get dataSource(): DataSourceContext {
        return this._dataSource
    }
}

export {DatabaseManager}