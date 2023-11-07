import { DataSourceInterface } from './data-source.interface';
import { DataSourcePostgres } from '../data-source-postgres';
import { PoolClient } from 'pg';
import { Connection } from 'mysql2/promise';
import { ConnectionData } from '../types/connection-data';
import { EntityInterface } from './entity.interface';

export interface DataSourceContextInterface {
	client: DataSourceInterface extends DataSourcePostgres ? PoolClient : Connection;

	setDatabase(dataSource: DataSourceInterface): void;

	connectDatabase(connectionData: ConnectionData): Promise<void>;

	createTables(entities: EntityInterface[]): Promise<void>;
}