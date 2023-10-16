import {Pool, Client, PoolConfig, PoolClient} from 'pg';
import {ConnectionOptions, createConnection} from "mysql2";
import {Connection as BaseConnection} from "mysql2/typings/mysql/lib/Connection";


export interface DataSourceInterface {
    client
    connect(dataToConnect: DataToConnect);
}

export class DataSourcePostgres implements DataSourceInterface {
    // private pool: Pool;
    client: PoolClient;

    async connect(dataToConnect: DataToConnect) {
        const pool = new Pool(dataToConnect);
        this.client = await pool.connect();
    }

}

export class DataSourceMySql implements DataSourceInterface {
    client: BaseConnection;

    connect(dataToConnect: DataToConnect) {
        this.client = createConnection(dataToConnect);
    }
}

export enum DatabasesTypes {
    POSTGRES = 'postgres',
    MYSQL = 'mysql'
}

export type DataToConnect = PoolConfig & ConnectionOptions & {
    type: DatabasesTypes
}

class DataSource {
    private dataSource: DataSourceInterface;
    client

    setDatabase(dataSource: DataSourceInterface) {
        this.dataSource = dataSource;
    }

    connectDatabase(dataToConnect: any) {
        this.dataSource.connect(dataToConnect);

        this.client = this.dataSource.client;
    }
}
const dataSource = new DataSource();

export function testConnection(dataToConnect: DataToConnect) {
    console.log("try try try try try try try try 1111111")
    if (dataToConnect.type === DatabasesTypes.POSTGRES) {
        dataSource.setDatabase(new DataSourcePostgres());

        dataSource.connectDatabase(dataToConnect)

        try {
            const {rows} = dataSource.client.query('SELECT current_user')
            const currentUser = rows[0]['current_user'];
            console.log('currentUser', currentUser)
        } catch (e) {
            console.error(e);
        }
        finally {
            dataSource.client.release();
        }
    }

    if (dataToConnect.type === DatabasesTypes.MYSQL) {
        dataSource.setDatabase(new DataSourceMySql());
        const {type, ...data} = dataToConnect;
        dataSource.connectDatabase(data)

        dataSource.client.query(
            "SELECT * FROM `table1`",
            function(err, results, fields) {
                console.log('resultsresultsresultsresults', results);
                console.log('fielfieldsfieldsfieldsds', fields);
                console.log('errerrerrerr', err)
            }
        );
    }
    // await orm.connectPostgres({
    //     type: DatabasesTypes.POSTGRES,
    //     user: 'postgres',
    //     host: 'localhost',
    //     database: 'postgres',
    //     password: 'myrosia2016',
    //     port: 5432,
    // })
    console.log("try try try try try try try try 3333")
}

export function Column(sdf: string): any {
    console.log("second(): factory evaluated", sdf);
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("second(): called", target, propertyKey, descriptor);
    };
}

export function Table(args?: any): any {
    return function (constructor: any): void {
        const tableName = constructor.name;
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS ${tableName} (
                id INT AUTO_INCREMENT PRIMARY KEY
            );
        `;

        dataSource.client.query(createTableSQL, (err, results, fields) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`Table ${tableName} created successfully.`);
            }
        });
    };
}