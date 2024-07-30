import * as fs from 'fs';
import * as path from 'path';
import { LoggerInterface } from './common';

export class Logger implements LoggerInterface {
	private logFile = path.join(process.cwd(), 'app.log');

	log(message: string, sql?: string, params?: string): void {
		const timestamp = new Date().toISOString();
		params = typeof params === 'object' ? JSON.stringify(params) : params;
		fs.appendFileSync(this.logFile, `${timestamp} - INFO: ${message}${sql ? ', SQL: ' + sql : ''}${params ? ', PARAMS: ' + params : ''}\n`);
	}

	error(message: string, sql?: string, params?: string): void {
		const timestamp = new Date().toISOString();
		params = typeof params === 'object' ? JSON.stringify(params) : params;
		fs.appendFileSync(this.logFile, `${timestamp} - ERROR: ${message}${sql ? ', SQL: ' + sql : ''}${params ? ', PARAMS: ' + params : ''}\n`);
	}
}