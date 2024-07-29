import { DataSourceInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';

export interface MonitoringInterface<DT extends DatabasesTypes> {
	getCPUUsage(dataSource: DataSourceInterface<DT>): Promise<unknown>;

	getMemoryUsage(dataSource: DataSourceInterface<DT>): Promise<unknown>;

	getDiskUsage(dataSource: DataSourceInterface<DT>): Promise<unknown>;

	getActiveConnections(dataSource: DataSourceInterface<DT>): Promise<unknown>;

	getWaitingConnections(dataSource: DataSourceInterface<DT>): Promise<unknown>;
}