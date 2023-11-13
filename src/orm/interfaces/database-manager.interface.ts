import { ConnectionClient, ConnectionData } from '../types';
import { DataSourceContext } from '../data-source-context';
import { TableManipulation } from '../table-manipulation';

export interface DatabaseManagerInterface {
	connectionData: ConnectionData;
	dataSource: DataSourceContext;
	tableManipulation: TableManipulation;

	connection(): Promise<ConnectionClient>;
}