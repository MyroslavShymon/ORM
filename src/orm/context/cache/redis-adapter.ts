import { CacheInterface } from '@context/common';
import { RedisClientType } from 'redis';

export class RedisAdapter implements CacheInterface {
	private client: RedisClientType;

	async init(): Promise<void> {
		const { createClient } = (await import('redis'));
		this.client = createClient();
		await this.client
			.on('error', err => console.log('Redis Client Error', err))
			.connect();
	}

	async set(key: string, value: unknown, ttl?: number): Promise<void> {
		await this.client.set(key, JSON.stringify(value));
	}

	async get(key: string): Promise<any> {
		const reply = await this.client.get(key);
		return reply ? JSON.parse(reply) : null;
	}

	async delete(key: string): Promise<void> {
		await this.client.del(key);
	}
}