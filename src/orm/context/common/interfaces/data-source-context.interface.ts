import { PoolClient } from 'pg';
import { Connection } from 'mysql2/promise';
import { DataSourceInterface } from '@core/interfaces';
import { ConnectionData } from '@core/types';
import {
	MigrationManagerInterface,
	QueryBuilderInterface,
	TableCreatorInterface,
	TableManipulationInterface
} from '@context/common';
import { DatabasesTypes } from '@core/enums';

export interface DataSourceContextInterface<DT extends DatabasesTypes> {
	client: DT extends DatabasesTypes.POSTGRES ? PoolClient : Connection;
	tableManipulation: TableManipulationInterface<DT>;
	tableCreator: TableCreatorInterface<DT>;
	migrationManager: MigrationManagerInterface<DT>;

	queryBuilder<T>(): QueryBuilderInterface<T>;

	setDatabase(dataSource: DataSourceInterface<DT>): void;

	connectDatabase(connectionData: ConnectionData): Promise<void>;

	query(sql: string): Promise<Object>;

	getCurrentTime(): Promise<Object>;
}