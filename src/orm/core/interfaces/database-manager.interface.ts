import { ConnectionClient, ConnectionData } from '../types';
import { DataSourceContextInterface, TableManipulationInterface } from '../../context';

export interface DatabaseManagerInterface {
	connectionData: ConnectionData;
	dataSource: DataSourceContextInterface;
	tableManipulation: TableManipulationInterface;

	connection(): Promise<ConnectionClient>;
}