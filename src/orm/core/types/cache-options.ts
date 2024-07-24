import { RedisSocketOptions } from '@redis/client/dist/lib/client/socket';

export type CacheOptions = {
	url?: string;
	username?: string;
	password?: string;
	name?: string;
	database?: number;
	socket?: RedisSocketOptions;
}