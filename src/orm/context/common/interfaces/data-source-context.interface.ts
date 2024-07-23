import { DataSourceInterface } from '@core/interfaces';
import { ConnectionData } from '@core/types';
import {
	CacheInterface,
	EventManagerInterface,
	MigrationManagerInterface,
	QueryBuilderInterface,
	TableCreatorInterface,
	TableManipulationInterface
} from '@context/common';
import { DatabasesTypes } from '@core/enums';

export interface DataSourceContextInterface<DT extends DatabasesTypes> {
	tableManipulation: TableManipulationInterface<DT>;
	tableCreator: TableCreatorInterface<DT>;
	migrationManager: MigrationManagerInterface<DT>;
	eventManager: EventManagerInterface;

	queryBuilder<T>(): QueryBuilderInterface<T>;

	setDatabase(dataSource: DataSourceInterface<DT>): void;

	setCache(cache: CacheInterface): void;

	connectDatabase(connectionData: ConnectionData): Promise<void>;

	query(sql: string): Promise<Object>;

	getCurrentTime(): Promise<Object>;
}