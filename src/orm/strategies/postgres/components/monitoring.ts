import { DatabasesTypes } from '@core/enums';
import { DataSourceInterface } from '@core/interfaces';
import {
	ActiveConnectionsInterface,
	CpuUsageInterface,
	DiskUsageInterface,
	MemoryUsageInterface,
	MonitoringInterface,
	WaitingConnectionsInterface
} from '@strategies/postgres';

export class Monitoring implements MonitoringInterface<DatabasesTypes.POSTGRES> {
	async getCPUUsage(dataSource: DataSourceInterface<DatabasesTypes.POSTGRES>): Promise<CpuUsageInterface[]> {
		const getCPUUsageQuery = `
            SELECT pid,
                   usename,
                   application_name,
                   client_addr,
                   backend_start,
                   state,
                   state_change,
                   query
            FROM pg_stat_activity;`;

		const CPUUsage = await dataSource.client.query(getCPUUsageQuery);
		return CPUUsage.rows;
	}

	async getMemoryUsage(dataSource: DataSourceInterface<DatabasesTypes.POSTGRES>): Promise<MemoryUsageInterface> {
		const getMemoryUsageQuery = `
			 SELECT
				pg_size_pretty(pg_database_size(current_database())) AS database_size,
				pg_size_pretty(sum(pg_relation_size(oid))) AS total_table_size,
				pg_size_pretty(sum(pg_indexes_size(oid))) AS total_index_size,
				pg_size_pretty(sum(pg_total_relation_size(oid) - pg_relation_size(oid) - pg_indexes_size(oid))) AS total_toast_size
			FROM
				pg_class
			WHERE
				relkind = 'r';`;

		const memoryUsage = await dataSource.client.query(getMemoryUsageQuery);
		return memoryUsage.rows[0];
	}

	async getDiskUsage(dataSource: DataSourceInterface<DatabasesTypes.POSTGRES>): Promise<DiskUsageInterface[]> {
		const getDiskUsageQuery = `
            SELECT pg_database.datname                                   AS database_name,
                   pg_size_pretty(pg_database_size(pg_database.datname)) AS size
            FROM pg_database
            ORDER BY pg_database_size(pg_database.datname) DESC;`;

		const diskUsage = await dataSource.client.query(getDiskUsageQuery);
		return diskUsage.rows;
	}

	async getActiveConnections(dataSource: DataSourceInterface<DatabasesTypes.POSTGRES>): Promise<ActiveConnectionsInterface> {
		const getActiveConnectionsQuery = `
            SELECT COUNT(*) AS active_connections
            FROM pg_stat_activity
            WHERE state = 'active';`;

		const activeConnections = await dataSource.client.query(getActiveConnectionsQuery);
		return activeConnections.rows[0];
	}

	async getWaitingConnections(dataSource: DataSourceInterface<DatabasesTypes.POSTGRES>): Promise<WaitingConnectionsInterface> {
		const getWaitingConnectionsQuery = `
            SELECT COUNT(*) AS waiting_connections
            FROM pg_stat_activity
            WHERE wait_event IS NOT NULL;`;

		const waitingConnections = await dataSource.client.query(getWaitingConnectionsQuery);
		return waitingConnections.rows[0];
	}

}