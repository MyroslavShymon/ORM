import { MonitoringInterface, MonitoringType } from './common';
import * as fs from 'fs';
import * as path from 'path';

export class Monitoring implements MonitoringInterface {
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
}