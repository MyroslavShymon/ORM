import { ConnectionData } from '@core/types';
import { QueryBuilderInterface, TableCreatorInterface, TableManipulationInterface } from '@context/common';
import { DatabasesTypes } from '@core/enums';

export interface DatabaseManagerInterface<DT extends DatabasesTypes> {
	connectionData: ConnectionData;

	tableCreator: TableCreatorInterface<DT>;

	queryBuilder<T>(): QueryBuilderInterface<T>;

	query(sql: string): Promise<Object>;

	connectDatabase(): Promise<void>;

	createOrmConnection(): Promise<void>;

	get tableManipulation(): TableManipulationInterface<DT>;
}