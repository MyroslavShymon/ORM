import { PoolClient } from 'pg';
import { Connection } from 'mysql2/promise';
import { DataSourcePostgres } from '@strategies/postgres';
import { DataSourceInterface } from '@core/interfaces';
import { ConnectionData } from '@core/types';
import {
	MigrationManagerInterface,
	QueryBuilderInterface,
	TableCreatorInterface,
	TableManipulationInterface
} from '@context/common';
import { DatabasesTypes } from '@core/enums';

export interface DataSourceContextInterface<DT extends DatabasesTypes | undefined> {
	client: DataSourceInterface extends DataSourcePostgres ? PoolClient : Connection;
	tableManipulation: TableManipulationInterface<DT>;
	tableCreator: TableCreatorInterface;
	migrationManager: MigrationManagerInterface;

	queryBuilder<T>(): QueryBuilderInterface<T>;

	setDatabase(dataSource: DataSourceInterface<DT>): void;

	connectDatabase(connectionData: ConnectionData): Promise<void>;

	query(sql: string): Promise<Object>;

	getCurrentTime(): Promise<Object>;
}