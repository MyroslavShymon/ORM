import {Pool, Client, PoolConfig, PoolClient} from 'pg';

export enum DatabasesTypes {
    POSTGRES = 'postgres',
    MYSQL = 'mysql'
}

export interface DataToConnect extends PoolConfig {
    type: DatabasesTypes;
}

class ORM {
    private pool: Pool;
    client: PoolClient;


    async connectPostgres(dataToConnection: DataToConnect) {
        this.pool = new Pool(dataToConnection);
        this.client = await this.pool.connect()
    }


}



export async function testConnection() {
    const orm = new ORM()
    await orm.connectPostgres({
        type: DatabasesTypes.POSTGRES,
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: 'myrosia2016',
        port: 5432,
    })

    console.log("test test test 2")

    try {
        const {rows} = await orm.client.query('SELECT current_user')
        const currentUser = rows[0]['current_user'];
        console.log('currentUser', currentUser)
    } catch (e) {
        console.error(e);
    }
    finally {
        orm.client.release();
    }
}