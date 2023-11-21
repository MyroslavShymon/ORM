import { ConnectionClient, ConnectionData } from '@core/types';
import { DataSourceContextInterface, TableManipulationInterface } from '@context/interfaces';

export interface DatabaseManagerInterface {
	connectionData: ConnectionData;
	dataSource: DataSourceContextInterface;
	tableManipulation: TableManipulationInterface;

	connection(): Promise<ConnectionClient>;
}