export interface LoggerInterface {
	log(message: string, sql?: string, params?: string): void;

	error(message: string, sql?: string, params?: string): void;
}