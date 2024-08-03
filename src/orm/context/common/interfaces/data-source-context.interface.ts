import { ConnectionData } from '@core/types';
import {
	CacheInterface,
	EventManagerInterface,
	IngotCreatorInterface,
	MigrationManagerInterface,
	QueryBuilderInterface,
	TableCreatorInterface,
	TableManipulationInterface,
	TransactionManagerInterface,
	TriggerManagerInterface
} from '@context/common';
import { DatabasesTypes } from '@core/enums';
import { DataSourceInterface, IndexInterface, TriggerInterface } from '@core/interfaces';
import { LoggerInterface, MonitoringInterface } from '../../../monitoring';

export interface DataSourceContextInterface<DT extends DatabasesTypes> {
	set logger(logger: LoggerInterface);

	set monitoring(monitoring: MonitoringInterface<DT>);

	set database(dataSource: DataSourceInterface<DT>);

	set cache(cache: CacheInterface);

	set connectionData(connectionData: ConnectionData);

	tableManipulation: TableManipulationInterface<DT>;
	tableCreator: TableCreatorInterface<DT>;
	triggerCreator: IngotCreatorInterface<TriggerInterface<DT>>;
	indexCreator: IngotCreatorInterface<IndexInterface<DT>>;
	migrationManager: MigrationManagerInterface<DT>;
	eventManager: EventManagerInterface;
	transactionManager: TransactionManagerInterface;
	triggerManager: TriggerManagerInterface<DT>;

	queryBuilder<T>(): QueryBuilderInterface<T>;

	connectDatabase(connectionData: ConnectionData): Promise<void>;

	query<T>(sql: string, params: any[]): Promise<T>;

	getCurrentTime(): Promise<Object>;
}