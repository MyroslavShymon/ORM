import { ConnectionClient, ConnectionData } from '@core/types';
import { QueryBuilderInterface, TableCreatorInterface, TableManipulationInterface } from '@context/interfaces';

export interface DatabaseManagerInterface {
	connectionData: ConnectionData;

	tableManipulation: TableManipulationInterface;
	tableCreator: TableCreatorInterface;

	queryBuilder<T>(): QueryBuilderInterface<T>;

	query(sql: string): Promise<Object>;

	connectDatabase(): Promise<void>;

	createOrmConnection(): Promise<ConnectionClient>;
}