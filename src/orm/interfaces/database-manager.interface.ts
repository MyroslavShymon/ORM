import { ConnectionClient, ConnectionData } from '../types';
import { DataSourceContext } from '../data-source-context';

export interface DatabaseManagerInterface {
	connectionData: ConnectionData;
	dataSource: DataSourceContext;

	connection(): Promise<ConnectionClient>;
}