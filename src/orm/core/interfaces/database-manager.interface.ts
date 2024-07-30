import { ConnectionData } from '@core/types';
import {
	EventManagerInterface,
	QueryBuilderInterface,
	TableCreatorInterface,
	TableManipulationInterface
} from '@context/common';
import { DatabasesTypes } from '@core/enums';
import { LoggerInterface } from '../../monitoring';

export interface DatabaseManagerInterface<DT extends DatabasesTypes> {
	connectionData: ConnectionData;

	tableCreator: TableCreatorInterface<DT>;

	eventManager: EventManagerInterface;

	logger: LoggerInterface;

	queryBuilder<T>(): QueryBuilderInterface<T>;

	query<T>(sql: string, params?: any[]): Promise<T>;

	connectDatabase(): Promise<void>;

	createOrmConnection(): Promise<void>;

	get tableManipulation(): TableManipulationInterface<DT>;

	transaction(callback: (trx: DatabaseManagerInterface<DT>) => Promise<void>): Promise<void>;
}