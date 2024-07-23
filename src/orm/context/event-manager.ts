import { CacheInterface, EventManagerInterface } from '@context/common';

export class EventManager implements EventManagerInterface {
	_cache: CacheInterface;

	constructor(cache: CacheInterface) {
		this._cache = cache;
	}

	async clearCache(key: string): Promise<void> {
		await this._cache.delete(key);
	}

}