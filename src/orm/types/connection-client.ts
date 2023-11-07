import { DataSourceContext } from '../data-source-context';
import { ConnectionData } from './connection-data';

export type ConnectionClient = {
	dataSource: DataSourceContext,
	connectionData: ConnectionData,
}