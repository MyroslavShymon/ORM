import { CacheInterface, CacheManagerInterface, EventManagerInterface } from '@context/common';
import { CacheManager } from '@context/events/cache/cache-manager';

export class EventManager implements EventManagerInterface {
	_cache: CacheInterface;

	constructor(cache: CacheInterface) {
		this._cache = cache;
	}

	get cache(): CacheManagerInterface {
		return new CacheManager(this._cache);
	}
}