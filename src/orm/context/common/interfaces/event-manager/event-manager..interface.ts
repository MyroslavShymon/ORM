export interface EventManagerInterface {
	clearCache(key: string): Promise<void>;
}