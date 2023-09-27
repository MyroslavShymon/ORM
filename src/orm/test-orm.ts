import {Pool, Client} from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'myrosia2016',
    port: 5432,

});

export async function testConnection() {
    const client = await pool.connect();

    console.log("test test test")


    try {
        const {rows} = await client.query('SELECT current_user')
        const currentUser = rows[0]['current_user'];
        console.log('currentUser', currentUser)
    } catch (e) {
        console.error(e);
    }
    finally {
        client.release();
    }
}


export const test = (elements, field) => {
    return elements.map((element) => element[field]);
}