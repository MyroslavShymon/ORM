export class Sanitizer {
	private static readonly MAX_IDENTIFIER_LENGTH = 64;
	private static readonly RESERVED_WORDS = [
		'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'ON', 'CREATE', 'DROP', 'ALTER', 'TABLE', 'COLUMN', 'INDEX', 'DATABASE', 'USE', 'IF', 'EXISTS', 'AND', 'OR', 'NOT', 'NULL', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'UNIQUE', 'CHECK', 'DEFAULT', 'AUTO_INCREMENT', 'IN', 'LIKE', 'IS', 'BETWEEN', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'
	];

	public static sanitize(input: string, type?: 'string' | 'number' | 'identifier'): string | number {
		if (typeof input === 'number') {
			return this.sanitizeNumber(input);
		}

		switch (type) {
			case 'number':
				return this.sanitizeNumber(input);
			case 'identifier':
				return this.sanitizeIdentifier(input);
			default:
				return this.autoSanitize(input);
		}
	}

	private static sanitizeNumber(input: string): number {
		const num = Number(input);
		if (isNaN(num)) {
			throw new Error('Invalid number input');
		}
		return num;
	}

	private static sanitizeIdentifier(input: string): string {
		if (input.length > this.MAX_IDENTIFIER_LENGTH) {
			throw new Error(`Identifier exceeds maximum length of ${this.MAX_IDENTIFIER_LENGTH}`);
		}

		if (!/^[a-zA-Z_][\w$]*$/.test(input)) {
			throw new Error('Invalid identifier input');
		}

		if (this.RESERVED_WORDS.includes(input.toUpperCase())) {
			throw new Error('Identifier is a reserved SQL word');
		}

		return input;
	}

	private static autoSanitize(input: string): string {
		if (this.isXml(input)) {
			return this.escapeXml(input);
		}

		if (this.isHtml(input)) {
			return this.escapeHtml(input);
		}

		if (this.isJson(input)) {
			return this.escapeJson(input);
		}

		if (this.isUrl(input)) {
			return this.escapeUrl(input);
		}

		if (this.isPath(input)) {
			return this.sanitizePath(input);
		}

		if (this.isShellCommand(input)) {
			return this.escapeShellCommand(input);
		}

		if (this.isPrintModel(input)) {
			return this.escapePrintModel(input);
		}

		if (this.isInjection(input)) {
			return this.escapeInjection(input);
		}

		return this.defaultSanitize(input);
	}

	private static defaultSanitize(input: string): string {
		return input
			.replace(/\\/g, '\\\\')
			.replace(/'/g, '\'\'')
			.replace(/"/g, '\\"')
			.replace(/;/g, '\\;')
			.replace(/--/g, '\\--')
			.replace(/\0/g, '\\0');
	}

	private static isHtml(input: string): boolean {
		return /<\/?[a-z][\s\S]*>/i.test(input);
	}

	private static isXml(input: string): boolean {
		return /<\?xml[\s\S]*\?>|<\/?[a-z][\s\S]*>/i.test(input);
	}

	private static isJson(input: string): boolean {
		if (typeof input !== 'string') {
			return false;
		}

		if (input.trim().length === 0) {
			return false;
		}

		if ((input.startsWith('{') && input.endsWith('}')) || (input.startsWith('[') && input.endsWith(']'))) {
			try {
				const parsed = JSON.parse(input);
				return typeof parsed === 'object' && parsed !== null;
			} catch {
				return false;
			}
		}

		return false;
	}

	private static isUrl(input: string): boolean {
		return /^https?:\/\//i.test(input);
	}

	private static isPath(input: string): boolean {
		return /[\/\\]/.test(input);
	}

	private static isShellCommand(input: string): boolean {
		return /[\s'";&|`$()<>]/.test(input);
	}

	private static isPrintModel(input: string): boolean {
		return /[%$#]/.test(input);
	}

	private static isInjection(input: string): boolean {
		return /(['"]).*\1|(--|\/\*|\*\/|;)/.test(input);
	}

	private static escapeHtml(input: string): string {
		return input
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}

	private static escapeXml(input: string): string {
		return input
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&apos;');
	}

	private static escapeJson(input: string): string {
		try {
			const parsed = JSON.parse(input);
			return JSON.stringify(parsed);
		} catch {
			return 'Invalid JSON';
		}
	}

	private static escapeUrl(input: string): string {
		return encodeURIComponent(input);
	}

	private static sanitizePath(input: string): string {
		return input
			.replace(/\.\.\//g, '')
			.replace(/\\/g, '/')
			.replace(/\/{2,}/g, '/');
	}

	private static escapeShellCommand(input: string): string {
		return input
			.replace(/\\/g, '\\\\')
			.replace(/"/g, '\\"')
			.replace(/'/g, '\\\'')
			.replace(/;/g, '\\;')
			.replace(/&/g, '\\&')
			.replace(/\|/g, '\\|')
			.replace(/`/g, '\\`')
			.replace(/\$/g, '\\$')
			.replace(/\(/g, '\\(')
			.replace(/\)/g, '\\)')
			.replace(/\</g, '\\<')
			.replace(/\>/g, '\\>');
	}

	private static escapePrintModel(input: string): string {
		return input
			.replace(/\\{/g, '\\\\{')
			.replace(/\\}/g, '\\\\}')
			.replace(/%/g, '\\%')
			.replace(/\$/g, '\\$')
			.replace(/#/g, '\\#');
	}

	private static escapeInjection(input: string): string {
		return input
			.replace(/(['"]).*\1/g, '')
			.replace(/--|\/\*|\*\/|;/g, '');
	}
}