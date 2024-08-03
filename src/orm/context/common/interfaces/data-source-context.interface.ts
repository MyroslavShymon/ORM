import { ConnectionData } from '@core/types';
import {
	CacheInterface,
	EventManagerInterface,
	IndexCreatorInterface,
	MigrationManagerInterface,
	QueryBuilderInterface,
	TableCreatorInterface,
	TableManipulationInterface,
	TransactionManagerInterface,
	TriggerCreatorInterface,
	TriggerManagerInterface
} from '@context/common';
import { DatabasesTypes } from '@core/enums';
import { DataSourceInterface } from '@core/interfaces';
import { LoggerInterface, MonitoringInterface } from '../../../monitoring';

export interface DataSourceContextInterface<DT extends DatabasesTypes> {
	set logger(logger: LoggerInterface);

	set monitoring(monitoring: MonitoringInterface<DT>);

	set database(dataSource: DataSourceInterface<DT>);

	set cache(cache: CacheInterface);

	set connectionData(connectionData: ConnectionData);

	tableManipulation: TableManipulationInterface<DT>;
	tableCreator: TableCreatorInterface<DT>;
	triggerCreator: TriggerCreatorInterface;
	indexCreator: IndexCreatorInterface<DT>;
	migrationManager: MigrationManagerInterface<DT>;
	eventManager: EventManagerInterface;
	transactionManager: TransactionManagerInterface;
	triggerManager: TriggerManagerInterface<DT>;

	queryBuilder<T>(): QueryBuilderInterface<T>;

	connectDatabase(connectionData: ConnectionData): Promise<void>;

	query<T>(sql: string, params: any[]): Promise<T>;

	getCurrentTime(): Promise<Object>;
}