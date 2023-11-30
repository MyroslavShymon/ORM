import { PoolClient } from 'pg';
import { Connection } from 'mysql2/promise';
import { DataSourcePostgres } from '@strategies/postgres';
import { DataSourceInterface } from '@core/interfaces';
import { TableManipulationInterface } from '@context/interfaces/table-manipulations';
import { TableCreatorInterface } from '@context/interfaces/table-creator/table-creator.interface';
import { ConnectionData } from '@core/types';
import { MigrationManagerInterface } from '@context/interfaces/migration-manager';

export interface DataSourceContextInterface {
	client: DataSourceInterface extends DataSourcePostgres ? PoolClient : Connection;
	tableManipulation: TableManipulationInterface;
	tableCreator: TableCreatorInterface;
	migrationManager: MigrationManagerInterface;

	setDatabase(dataSource: DataSourceInterface): void;

	connectDatabase(connectionData: ConnectionData): Promise<void>;

	getCurrentTime(): Promise<Object>;
}