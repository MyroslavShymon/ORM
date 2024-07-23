import { CacheType } from '@core/types';
import { CacheInterface } from '@context/common';

export class CacheFactory {
	static async createCache(type: CacheType): Promise<CacheInterface> {
		if (type === 'redis') {
			const { RedisAdapter } = await import('./redis-adapter');
			const redisAdapter = new RedisAdapter();
			await redisAdapter.init();
			return redisAdapter;
		} else if (type === 'memcached') {
			console.log('Coming soon...');
			// const { MemcachedAdapter } = await import('./memcachedAdapter');
			// const memcachedAdapter = new MemcachedAdapter();
			// await memcachedAdapter.init();
			// return memcachedAdapter;
		} else {
			throw new Error('Unsupported cache type');
		}
	}
}