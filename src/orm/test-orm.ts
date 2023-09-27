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

    async connectDatabase(dataToConnect: DataToConnect) {
        await this.dataSource.connect(dataToConnect);
        this.client = this.dataSource.client;
    }
}

export async function testConnection(type: DatabasesTypes) {
    const dataSource = new DataSource();
    if (type === DatabasesTypes.POSTGRES) {
        dataSource.setDatabase(new DataSourcePostgres());

        await dataSource.connectDatabase({
            type: DatabasesTypes.POSTGRES,
            user: 'postgres',
            host: 'localhost',
            database: 'postgres',
            password: 'myrosia2016',
            port: 5432,
        })

        try {
            const {rows} = await dataSource.client.query('SELECT current_user')
            const currentUser = rows[0]['current_user'];
            console.log('currentUser', currentUser)
        } catch (e) {
            console.error(e);
        }
        finally {
            dataSource.client.client.release();
        }
    }

    if (type === DatabasesTypes.MYSQL) {
        dataSource.setDatabase(new DataSourceMySql());

        await dataSource.connectDatabase({
            type: DatabasesTypes.MYSQL,
            host: 'localhost',
            user: 'root',
            database: 'first'
        })

        dataSource.client.query(
            "SELECT * FROM `table1`",
            function(err, results, fields) {
                console.log('resultsresultsresultsresults', results);
                console.log('fielfieldsfieldsfieldsds', fields);
                console.log('errerrerrerr', err)
            }
        );
    }
    // const orm = new ORM()
    // await orm.connectPostgres({
    //     type: DatabasesTypes.POSTGRES,
    //     user: 'postgres',
    //     host: 'localhost',
    //     database: 'postgres',
    //     password: 'myrosia2016',
    //     port: 5432,
    // })
    //
    console.log("test test test 4")
}