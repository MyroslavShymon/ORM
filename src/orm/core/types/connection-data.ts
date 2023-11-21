import { PoolConfig } from 'pg';
import { ConnectionOptions } from 'mysql2';
import { DatabasesTypes } from '@core/enums';
import { EntityInterface } from '@core/interfaces';

// Дані які треба для під'єднання
export type ConnectionData = PoolConfig & ConnectionOptions & {
	type: DatabasesTypes
	entities?: EntityInterface[]
}