import { PoolConfig } from 'pg';
import { ConnectionOptions } from 'mysql2';
import { DatabasesTypes } from '../enums/databases-types';
import { EntityInterface } from '../interfaces/entity.interface';

// Дані які треба для під'єднання
export type ConnectionData = PoolConfig & ConnectionOptions & {
	type: DatabasesTypes
	entities?: EntityInterface[]
}