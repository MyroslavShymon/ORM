import { Crypto } from './crypto';
import { FS } from './fs';
import { IncrementalTypeIndexator } from './incremental-type-indexator';
import { Sanitizer } from './sanitizer';
import { TypescriptCodeGenerator } from './typescript-code-generator';

export function isArrayArrayOfArrays(array: any[]): boolean {
	if (Array.isArray(array)) {
		return array.every(subArray => Array.isArray(subArray));
	}
	return false;
}

export { TypescriptCodeGenerator, FS, IncrementalTypeIndexator, Crypto, Sanitizer };