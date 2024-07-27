import * as fs from 'fs';
import * as path from 'path';

export class Logger {
	private logFile = path.join(process.cwd(), 'app.log');

	log(message: string, sql?: string, params?: string): void {
		const timestamp = new Date().toISOString();
		fs.appendFileSync(this.logFile, `${timestamp} - INFO: ${message}, SQL: ${sql}, PARAMS: ${params}\n`);
	}

	error(message: string, sql?: string, params?: string): void {
		const timestamp = new Date().toISOString();
		fs.appendFileSync(this.logFile, `${timestamp} - ERROR: ${message}, SQL: ${sql}, PARAMS: ${params}\n`);
	}
}