import { ConnectionData } from '@core/types';
import {
	CacheInterface,
	EventManagerInterface,
	MigrationManagerInterface,
	QueryBuilderInterface,
	TableCreatorInterface,
	TableManipulationInterface,
	TransactionManagerInterface
} from '@context/common';
import { DatabasesTypes } from '@core/enums';
import { DataSourceInterface } from '@core/interfaces';
import { LoggerInterface } from '../../../monitoring';

export interface DataSourceContextInterface<DT extends DatabasesTypes> {
	set logger(logger: LoggerInterface);

	set database(dataSource: DataSourceInterface<DT>);

	set cache(cache: CacheInterface);

	set connectionData(connectionData: ConnectionData);

	tableManipulation: TableManipulationInterface<DT>;
	tableCreator: TableCreatorInterface<DT>;
	migrationManager: MigrationManagerInterface<DT>;
	eventManager: EventManagerInterface;
	transactionManager: TransactionManagerInterface;

	queryBuilder<T>(): QueryBuilderInterface<T>;

	connectDatabase(connectionData: ConnectionData): Promise<void>;

	query(sql: string, params: any[]): Promise<Object>;

	getCurrentTime(): Promise<Object>;
}