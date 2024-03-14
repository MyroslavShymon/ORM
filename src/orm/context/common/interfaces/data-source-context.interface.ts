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

export interface DataSourceContextInterface {
	client: DataSourceInterface extends DataSourcePostgres ? PoolClient : Connection;
	tableManipulation: TableManipulationInterface;
	tableCreator: TableCreatorInterface;
	migrationManager: MigrationManagerInterface;

	queryBuilder<T>(): QueryBuilderInterface<T>;

	setDatabase(dataSource: DataSourceInterface): void;

	connectDatabase(connectionData: ConnectionData): Promise<void>;

	query(sql: string): Promise<Object>;

	getCurrentTime(): Promise<Object>;
}