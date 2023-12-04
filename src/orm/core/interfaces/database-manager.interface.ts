import { ConnectionClient, ConnectionData } from '@core/types';
import { TableCreatorInterface, TableManipulationInterface } from '@context/interfaces';

export interface DatabaseManagerInterface {
	connectionData: ConnectionData;
	
	tableManipulation: TableManipulationInterface;
	tableCreator: TableCreatorInterface;

	connection(): Promise<ConnectionClient>;
}