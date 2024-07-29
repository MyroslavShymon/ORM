import {
	ActiveConnectionsInterface,
	CpuUsageInterface,
	DiskUsageInterface,
	MemoryUsageInterface,
	MonitoringInterface,
	WaitingConnectionsInterface
} from '@strategies/mysql';
import { DatabasesTypes } from '@core/enums';
import { DataSourceInterface } from '@core/interfaces';

export class Monitoring implements MonitoringInterface<DatabasesTypes.MYSQL> {
	async getCPUUsage(dataSource: DataSourceInterface<DatabasesTypes.MYSQL>): Promise<CpuUsageInterface[]> {
		const getCPUUsageQuery = `
            SELECT THREAD_ID,
                   PROCESSLIST_USER,
                   PROCESSLIST_HOST,
                   PROCESSLIST_DB,
                   PROCESSLIST_COMMAND,
                   PROCESSLIST_TIME,
                   PROCESSLIST_STATE,
                   PROCESSLIST_INFO
            FROM performance_schema.threads
            WHERE PROCESSLIST_ID IS NOT NULL;`;

		const CPUUsage = await dataSource.client.query(getCPUUsageQuery);

		return CPUUsage[0];
	}

	async getMemoryUsage(dataSource: DataSourceInterface<DatabasesTypes.MYSQL>): Promise<MemoryUsageInterface[]> {
		const getMemoryUsageQuery = `
            SELECT EVENT_NAME,
                   CURRENT_NUMBER_OF_BYTES_USED,
                   HIGH_NUMBER_OF_BYTES_USED
            FROM performance_schema.memory_summary_global_by_event_name
            ORDER BY CURRENT_NUMBER_OF_BYTES_USED DESC LIMIT 10;`;

		const memoryUsage = await dataSource.client.query(getMemoryUsageQuery);
		return memoryUsage[0];
	}

	async getDiskUsage(dataSource: DataSourceInterface<DatabasesTypes.MYSQL>): Promise<DiskUsageInterface[]> {
		const getDiskUsageQuery = `
            SELECT TABLE_SCHEMA,
                   TABLE_NAME,
                   ROUND(SUM(DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024, 2) AS "Size (MB)"
            FROM information_schema.TABLES
            GROUP BY TABLE_SCHEMA, TABLE_NAME
            ORDER BY "Size (MB)" DESC LIMIT 10;`;

		const diskUsage = await dataSource.client.query(getDiskUsageQuery);
		return diskUsage[0];
	}

	async getActiveConnections(dataSource: DataSourceInterface<DatabasesTypes.MYSQL>): Promise<ActiveConnectionsInterface> {
		const getActiveConnectionsQuery = `
            SELECT COUNT(*) AS active_connections
            FROM information_schema.processlist
            WHERE COMMAND != 'Sleep';`;

		const activeConnections = await dataSource.client.query(getActiveConnectionsQuery);
		return activeConnections[0];
	}

	async getWaitingConnections(dataSource: DataSourceInterface<DatabasesTypes.MYSQL>): Promise<WaitingConnectionsInterface> {
		const getWaitingConnectionsQuery = `
            SELECT COUNT(*) AS waiting_connections
            FROM information_schema.processlist
            WHERE STATE = 'Waiting for table metadata lock';`;

		const waitingConnections = await dataSource.client.query(getWaitingConnectionsQuery);
		return waitingConnections[0];
	}
}