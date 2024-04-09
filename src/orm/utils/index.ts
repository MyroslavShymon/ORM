import { TypescriptCodeGenerator } from './typescript-code-generator';

export function isArrayArrayOfArrays(array: any[]): boolean {
	if (Array.isArray(array)) {
		return array.every(subArray => Array.isArray(subArray));
	}
	return false;
}

export { TypescriptCodeGenerator };