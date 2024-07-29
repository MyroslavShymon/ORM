import { DataSourceInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';
import {
	ActiveConnectionsInterface,
	CpuUsageInterface,
	DiskUsageInterface,
	MemoryUsageInterface,
	WaitingConnectionsInterface
} from '@strategies/mysql';

export interface MonitoringInterface<DT extends DatabasesTypes> {
	getCPUUsage(dataSource: DataSourceInterface<DT>): Promise<CpuUsageInterface[]>;

	getMemoryUsage(dataSource: DataSourceInterface<DT>): Promise<MemoryUsageInterface[]>;

	getDiskUsage(dataSource: DataSourceInterface<DT>): Promise<DiskUsageInterface[]>;

	getActiveConnections(dataSource: DataSourceInterface<DT>): Promise<ActiveConnectionsInterface>;

	getWaitingConnections(dataSource: DataSourceInterface<DT>): Promise<WaitingConnectionsInterface>;

}