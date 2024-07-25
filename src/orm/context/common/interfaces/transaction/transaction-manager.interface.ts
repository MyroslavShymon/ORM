export interface TransactionManagerInterface {
	beginTransaction(): Promise<void>;

	commit(): Promise<void>;

	rollback(): Promise<void>;
}