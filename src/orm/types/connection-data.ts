import {PoolConfig} from "pg";
import {ConnectionOptions} from "mysql2";
import {DatabasesTypes} from "../enums/databases-types";

// Дані які треба для під'єднання
export type ConnectionData = PoolConfig & ConnectionOptions & {
    type: DatabasesTypes
}