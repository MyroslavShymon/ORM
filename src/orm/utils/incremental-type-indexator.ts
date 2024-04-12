import * as ts from 'typescript';
import { constants } from '@core/constants';

export class IncrementalTypeIndexator {
	static performIncrementalTypeIndexing(configFilePath: string) {

		const configFileName = ts.findConfigFile(configFilePath, ts.sys.fileExists, 'tsconfig.json');

		if (!configFileName) {
			throw new Error('Could not find a valid \'tsconfig.json\'.');
		}

		const host = ts.createWatchCompilerHost(
			configFileName,
			{},
			ts.sys,
			ts.createSemanticDiagnosticsBuilderProgram,
			this._reportDiagnostic,
			this._reportWatchStatusChanged
		);

		const origCreateProgram = host.createProgram;
		host.createProgram = (rootNames, options, host, oldProgram) => {
			options.incremental = true; // Set parameter of incremental reindexing
			options.tsBuildInfoFile = './.tsbuildinfo';
			return origCreateProgram(rootNames, options, host, oldProgram);
		};

		ts.createWatchProgram(host);
	}

	private static _reportDiagnostic(diagnostic: ts.Diagnostic): void {
		// const localizedMessage = ts.formatDiagnosticsWithColorAndContext([diagnostic], ts.createCompilerHost({}));
		if (diagnostic.code === constants.errors.assignableToType) {
			throw Error(
				'Error ' +
				diagnostic.code +
				':'
				// + localizedMessage
			);
		}
		console.error(
			'Error',
			diagnostic.code,
			':',
			// localizedMessage
		);
	}

	private static _reportWatchStatusChanged(diagnostic: ts.Diagnostic): void {
		console.info(
			ts.formatDiagnostic(diagnostic, {
				getCanonicalFileName: (fileName) => fileName,
				getCurrentDirectory: ts.sys.getCurrentDirectory,
				getNewLine: () => ts.sys.newLine
			})
		);
	}
}