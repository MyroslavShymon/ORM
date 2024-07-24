export interface CacheManagerInterface {
	clearCache(key: string): Promise<void>;
}