import { PoolClient } from 'pg';
import { Connection } from 'mysql2/promise';
import { DataSourcePostgres } from '../strategy/strategies/postgres/data-source-postgres';
import { ConnectionData } from '../types';
import { DataSourceInterface } from './data-source.interface';
import { TableManipulationInterface } from './table-manipulations';
import { TableCreatorInterface } from '../strategy/context/interfaces';


export interface DataSourceContextInterface {
	client: DataSourceInterface extends DataSourcePostgres ? PoolClient : Connection;
	tableManipulation: TableManipulationInterface;
	tableCreator: TableCreatorInterface;

	setDatabase(dataSource: DataSourceInterface): void;

	connectDatabase(connectionData: ConnectionData): Promise<void>;

	getCurrentTime(): Promise<Object>;
}