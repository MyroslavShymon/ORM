import { MonitoringType } from './monitoring.type';
import { DatabasesTypes } from '@core/enums';
import { DataSourceInterface } from '@core/interfaces';

export interface MonitoringInterface<DT extends DatabasesTypes> {
	measureExecutionTime<T>(operation: () => Promise<T>, buildQuery: string, parameters: any, type?: MonitoringType): Promise<T>;

	getMonitoringMetrics(dataSource: DataSourceInterface<DT>): Promise<void>;
}