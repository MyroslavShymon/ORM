import { DataSourceContextInterface } from '@context/interfaces';
import { ConnectionData } from '@core/types/connection-data';

export type ConnectionClient = {
	dataSource: DataSourceContextInterface,
	connectionData: ConnectionData,
}