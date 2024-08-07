export interface CacheInterface {
	set(key: string, value: unknown, ttl?: number): Promise<void>;

	get(key: string): Promise<string>;

	delete(key: string): Promise<void>;
}