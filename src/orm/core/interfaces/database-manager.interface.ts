import { ConnectionClient, ConnectionData } from '@core/types';
import { QueryBuilderInterface, TableCreatorInterface, TableManipulationInterface } from '@context/common';
import { DatabasesTypes } from '@core/enums';

export interface DatabaseManagerInterface<DT extends DatabasesTypes | undefined> {
	connectionData: ConnectionData;

	tableCreator: TableCreatorInterface;

	queryBuilder<T>(): QueryBuilderInterface<T>;

	query(sql: string): Promise<Object>;

	connectDatabase(): Promise<void>;

	createOrmConnection(): Promise<ConnectionClient>;

	get tableManipulation(): TableManipulationInterface<DT>;
}