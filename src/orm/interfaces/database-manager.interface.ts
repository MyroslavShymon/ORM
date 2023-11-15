import { ConnectionClient, ConnectionData } from '../types';
import { TableManipulationInterface } from './table-manipulations';
import { DataSourceContextInterface } from './data-source-context.interface';

export interface DatabaseManagerInterface {
	connectionData: ConnectionData;
	dataSource: DataSourceContextInterface;
	tableManipulation: TableManipulationInterface;

	connection(): Promise<ConnectionClient>;
}