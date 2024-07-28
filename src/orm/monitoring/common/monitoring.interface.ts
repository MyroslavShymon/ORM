import { MonitoringType } from './monitoring.type';

export interface MonitoringInterface {
	measureExecutionTime<T>(operation: () => Promise<T>, buildQuery: string, parameters: any, type?: MonitoringType): Promise<T>;
}