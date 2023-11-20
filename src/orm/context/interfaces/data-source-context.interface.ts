import { PoolClient } from 'pg';
import { Connection } from 'mysql2/promise';
import { ConnectionData, DataSourceInterface } from '../../core';
import { TableManipulationInterface } from './table-manipulations';
import { DataSourcePostgres } from '../../strategies/postgres';
import { TableCreatorInterface } from './table-creator.interface';

export interface DataSourceContextInterface {
	client: DataSourceInterface extends DataSourcePostgres ? PoolClient : Connection;
	tableManipulation: TableManipulationInterface;
	tableCreator: TableCreatorInterface;

	setDatabase(dataSource: DataSourceInterface): void;

	connectDatabase(connectionData: ConnectionData): Promise<void>;

	getCurrentTime(): Promise<Object>;
}