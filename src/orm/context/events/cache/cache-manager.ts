import { CacheInterface, CacheManagerInterface } from '@context/common';

export class CacheManager implements CacheManagerInterface {
	_cache: CacheInterface;

	constructor(cache: CacheInterface) {
		this._cache = cache;
	}

	async clearCache(key: string): Promise<void> {
		await this._cache.delete(key);
	}
}