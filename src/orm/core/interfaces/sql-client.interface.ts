export interface SqlClientInterface {
	query: (text: string, params?: any[]) => Promise<any>;
}