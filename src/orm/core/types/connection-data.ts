import { PoolConfig } from 'pg';
import { ConnectionOptions } from 'mysql2';
import { DatabasesTypes } from '@core/enums';
import { ClassInterface } from '@core/interfaces';
import { CacheType } from '@core/types/cache.type';
import { CacheOptions } from '@core/types/cache-options';

// Дані які треба для під'єднання
export type ConnectionData = PoolConfig & ConnectionOptions & {
	type: DatabasesTypes;
	models?: ClassInterface[];
	migrationTable?: string;
	migrationTableSchema?: string;
	database?: string;
	logging?: boolean;
	monitoring?: boolean;
	sanitizer?: boolean;
	cache?: {
		type: CacheType,
		options: CacheOptions
	}
}