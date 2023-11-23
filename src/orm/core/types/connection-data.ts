import { PoolConfig } from 'pg';
import { ConnectionOptions } from 'mysql2';
import { DatabasesTypes } from '@core/enums';
import { ModelInterface } from '@core/interfaces';

// Дані які треба для під'єднання
export type ConnectionData = PoolConfig & ConnectionOptions & {
	type: DatabasesTypes;
	models?: ModelInterface[];
	entities?: string[];
	migrations?: string[];
}