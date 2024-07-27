export type CacheOptions = {
	url?: string;
	username?: string;
	password?: string;
	name?: string;
	database?: number;
	socket?: {
		connectTimeout?: number;
		noDelay?: boolean;
		keepAlive?: number | false;
		reconnectStrategy?: false | number | ((retries: number, cause: Error) => false | Error | number);
		tls?: any
	};
}