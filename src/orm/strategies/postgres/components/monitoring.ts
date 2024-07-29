import { DatabasesTypes } from '@core/enums';
import { DataSourceInterface } from '@core/interfaces';
import { MonitoringInterface } from '@strategies/postgres';

export class Monitoring implements MonitoringInterface<DatabasesTypes.POSTGRES> {
	async getCPUUsage(dataSource: DataSourceInterface<DatabasesTypes.POSTGRES>): Promise<unknown> {
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

		return dataSource.client.query(getCPUUsageQuery);
	}

	async getMemoryUsage(dataSource: DataSourceInterface<DatabasesTypes.POSTGRES>): Promise<unknown> {
		const getMemoryUsageQuery = `
            SELECT pg_stat_statements.queryid,
                   pg_stat_statements.calls,
                   pg_stat_statements.total_time,
                   pg_stat_statements.rows,
                   pg_stat_statements.shared_blks_hit,
                   pg_stat_statements.shared_blks_read,
                   pg_stat_statements.shared_blks_dirtied,
                   pg_stat_statements.shared_blks_written
            FROM pg_stat_statements
            ORDER BY pg_stat_statements.total_time DESC
            LIMIT 10;`;

		return dataSource.client.query(getMemoryUsageQuery);
	}

	async getDiskUsage(dataSource: DataSourceInterface<DatabasesTypes.POSTGRES>): Promise<unknown> {
		const getDiskUsageQuery = `
            SELECT pg_database.datname                                   AS database_name,
                   pg_size_pretty(pg_database_size(pg_database.datname)) AS size
            FROM pg_database
            ORDER BY pg_database_size(pg_database.datname) DESC;`;

		return dataSource.client.query(getDiskUsageQuery);
	}

	async getActiveConnections(dataSource: DataSourceInterface<DatabasesTypes.POSTGRES>): Promise<unknown> {
		const getActiveConnectionsQuery = `
            SELECT COUNT(*) AS active_connections
            FROM pg_stat_activity
            WHERE state = 'active';`;

		return dataSource.client.query(getActiveConnectionsQuery);
	}

	async getWaitingConnections(dataSource: DataSourceInterface<DatabasesTypes.POSTGRES>): Promise<unknown> {
		const getWaitingConnectionsQuery = `
            SELECT COUNT(*) AS waiting_connections
            FROM pg_stat_activity
            WHERE wait_event IS NOT NULL;`;

		return dataSource.client.query(getWaitingConnectionsQuery);
	}

}