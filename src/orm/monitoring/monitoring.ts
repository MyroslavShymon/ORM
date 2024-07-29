import { MonitoringInterface, MonitoringType } from './common';
import * as fs from 'fs';
import * as path from 'path';
import { DataSourceInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';
import { constants } from '@core/constants';

export class Monitoring<DT extends DatabasesTypes> implements MonitoringInterface<DT> {
	private monitoringFile = path.join(process.cwd(), 'monitoring.log');

	async measureExecutionTime<T>(operation: () => Promise<T>, buildQuery: string, parameters: any, type?: MonitoringType): Promise<T> {
		const startTime = performance.now();

		try {
			const result = await operation();

			const endTime = performance.now();
			const duration = endTime - startTime;
			fs.appendFileSync(this.monitoringFile, `Executed in ${duration} ms, TYPE: ${type || MonitoringType.RegularQuery}, SQL: ${buildQuery}, PARAMS: ${JSON.stringify(parameters)}\n`);

			return result;
		} catch (error) {
			const endTime = performance.now();
			const duration = endTime - startTime;
			fs.appendFileSync(this.monitoringFile, `Executed in ${duration} ms, TYPE: ${type || MonitoringType.RegularQuery}, ERROR: ${error}, SQL: ${buildQuery}, PARAMS: ${JSON.stringify(parameters)}\n`);
			throw error;
		}
	}

	async getMonitoringMetrics(dataSource: DataSourceInterface<DT>): Promise<void> {
		setInterval(() => {
			this._getMonitoringMetrics(dataSource).catch(error => console.error('Error in getMonitoringMetrics:', error));
		}, constants.monitoring.interval);
	}

	async _getMonitoringMetrics(dataSource: DataSourceInterface<DT>): Promise<void> {
		try {
			const CPUUsage = await dataSource.getCPUUsage(dataSource);
			const memoryUsage = await dataSource.getMemoryUsage(dataSource);
			const diskUsage = await dataSource.getDiskUsage(dataSource);
			const activeConnections = await dataSource.getActiveConnections(dataSource);
			const waitingConnections = await dataSource.getWaitingConnections(dataSource);

			const monitoringData = `
				CPU Usage: ${JSON.stringify(CPUUsage)}
				Memory Usage: ${JSON.stringify(memoryUsage)}
				Disk Usage: ${JSON.stringify(diskUsage)}
				Active Connections: ${JSON.stringify(activeConnections)}
				Waiting Connections: ${JSON.stringify(waitingConnections)}
				Timestamp: ${new Date().toISOString()}
			`;

			fs.appendFileSync(this.monitoringFile, monitoringData);
		} catch (error) {
			console.error('Error while fetching monitoring metrics:', error);
		}
	}
}