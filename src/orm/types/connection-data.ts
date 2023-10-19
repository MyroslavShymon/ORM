import {PoolConfig} from "pg";
import {ConnectionOptions} from "mysql2";
import {DatabasesTypes} from "../enums/databases-types";

export type ConnectionData = PoolConfig & ConnectionOptions & {
    type: DatabasesTypes
}