import { ConnectionData } from './connection-data';
import { DataSourceContextInterface } from '../interfaces';

export type ConnectionClient = {
	dataSource: DataSourceContextInterface,
	connectionData: ConnectionData,
}