import { ConnectionData } from './connection-data';
import { DataSourceContextInterface } from '../../context';

export type ConnectionClient = {
	dataSource: DataSourceContextInterface,
	connectionData: ConnectionData,
}